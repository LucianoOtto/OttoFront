import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import useProducts from "../../hooks/useProducts";
import useCategories from "../../hooks/useCategories";
import useSections from "../../hooks/useSections";
import { createProduct, updateProduct, deleteProduct, downloadProductImage } from "../../api/products";
import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";

const emptyForm = {
  id: null,
  name: "",
  description: "",
  price: "",
  image_url: "",
  category_id: "",
  section_id: "",
  material: "",
  estimated_print_time: "",
  makerworld_url: "",
  designer_name: "",
  license_status: "sin_revisar",
  license_notes: "",
  active: true,
};

const LICENSE_OPTIONS = [
  { value: "sin_revisar", label: "Sin revisar" },
  { value: "personal_no_vender", label: "Uso personal — NO se puede vender" },
  { value: "permite_venta", label: "Permite venta de impresiones" },
  { value: "licencia_comercial", label: "Requiere licencia comercial paga" },
];

// Bookmarklet: se ejecuta en la página de MakerWorld que el admin tiene
// abierta en su propio navegador (ya "humano" a ojos de Cloudflare), lee
// los metadatos og:* de esa página y abre el panel de admin con todo
// precargado por query params. Evita depender de que el servidor le pida
// la página a MakerWorld, que es justamente lo que Cloudflare bloquea.
function buildBookmarklet(adminUrl) {
  const code = `(function(){
    function meta(prop){
      var el = document.querySelector('meta[property="' + prop + '"]');
      return el ? el.getAttribute('content') : '';
    }
    var name = (meta('og:title') || document.title)
      .replace(/\\s*-\\s*Free 3D Print Model\\s*-\\s*MakerWorld\\s*$/i, '')
      .replace(/\\s*-\\s*MakerWorld\\s*$/i, '');
    var params = new URLSearchParams({
      import_name: name,
      import_description: meta('og:description') || '',
      import_image: meta('og:image') || '',
      import_url: location.href
    });
    window.open('${adminUrl}?' + params.toString(), '_blank');
  })();`;
  return `javascript:${encodeURIComponent(code)}`;
}

export default function AdminProducts() {
  const { products, loading, error, refetch } = useProducts();
  const { categories } = useCategories();
  const { sections } = useSections();
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [confirmId, setConfirmId] = useState(null);
  const [downloadingImage, setDownloadingImage] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const bookmarkletHref = useMemo(() => {
    if (typeof window === "undefined") return "";
    return buildBookmarklet(`${window.location.origin}/admin/productos`);
  }, []);

  // React 19 bloquea por seguridad cualquier href="javascript:..." que se
  // asigne vía JSX (para prevenir inyección de scripts). Como este SÍ es
  // un bookmarklet legítimo que el propio admin arrastra a sus marcadores,
  // seteamos el href directo sobre el nodo del DOM, evitando que React
  // intervenga en esa asignación puntual.
  const bookmarkletRef = useRef(null);
  useEffect(() => {
    if (bookmarkletRef.current && bookmarkletHref) {
      bookmarkletRef.current.setAttribute("href", bookmarkletHref);
    }
  }, [bookmarkletHref]);

  // Si llegamos acá desde el bookmarklet, precargamos el formulario con
  // lo que trajo de MakerWorld, bajamos la imagen a nuestro servidor y
  // limpiamos la URL. La licencia SIEMPRE arranca "sin revisar": nunca la
  // marcamos automáticamente como vendible.
  useEffect(() => {
    const importName = searchParams.get("import_name");
    if (!importName) return;

    const importImage = searchParams.get("import_image") || "";

    setForm((f) => ({
      ...f,
      name: importName,
      description: searchParams.get("import_description") || f.description,
      image_url: importImage,
      makerworld_url: searchParams.get("import_url") || f.makerworld_url,
      license_status: "sin_revisar",
      license_notes: "",
    }));
    toast.success("Datos importados desde MakerWorld. Revisá la licencia antes de publicar.");
    setSearchParams({}, { replace: true });
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (importImage) {
      setDownloadingImage(true);
      downloadProductImage(importImage)
        .then((res) => {
          setForm((f) => ({ ...f, image_url: res.image_url }));
          toast.success("Imagen guardada en tu propio servidor.");
        })
        .catch(() => {
          toast.warn(
            "No pudimos bajar la imagen a tu servidor; se guardó el link externo de MakerWorld como respaldo."
          );
        })
        .finally(() => setDownloadingImage(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const isEditing = form.id !== null;

  function startEdit(product) {
    setForm({
      id: product.id,
      name: product.name,
      description: product.description || "",
      price: product.price ?? "",
      image_url: product.image_url || "",
      category_id: product.category_id || "",
      section_id: product.section_id || "",
      material: product.material || "",
      estimated_print_time: product.estimated_print_time || "",
      makerworld_url: product.makerworld_url || "",
      designer_name: product.designer_name || "",
      license_status: product.license_status || "sin_revisar",
      license_notes: product.license_notes || "",
      active: product.active,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setForm(emptyForm);
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || form.price === "") return;

    // Si es un modelo de terceros (tiene link de MakerWorld) y todavía no
    // se revisó la licencia (o la licencia dice que no se puede vender),
    // no lo dejamos publicar activo en el catálogo por error.
    const isThirdParty = form.makerworld_url.trim() !== "";
    const licenseBlocksSale =
      form.license_status === "sin_revisar" || form.license_status === "personal_no_vender";
    if (isThirdParty && licenseBlocksSale && form.active) {
      toast.error(
        form.license_status === "sin_revisar"
          ? "Todavía no revisaste la licencia de este modelo. Revisala o desmarcá \"Visible en el catálogo\"."
          : "La licencia de este modelo es de uso personal: no se puede vender. Desmarcá \"Visible en el catálogo\"."
      );
      return;
    }

    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      price: Number(form.price),
      image_url: form.image_url.trim() || null,
      category_id: form.category_id ? Number(form.category_id) : null,
      section_id: form.section_id ? Number(form.section_id) : null,
      material: form.material.trim() || null,
      estimated_print_time: form.estimated_print_time.trim() || null,
      makerworld_url: form.makerworld_url.trim() || null,
      designer_name: form.designer_name.trim() || null,
      license_status: form.license_status,
      license_notes: form.license_notes.trim() || null,
      active: form.active,
    };

    setSaving(true);
    try {
      if (isEditing) {
        await updateProduct(form.id, payload);
        toast.success("Producto actualizado.");
      } else {
        await createProduct(payload);
        toast.success("Producto creado.");
      }
      setForm(emptyForm);
      refetch();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (confirmId !== id) {
      setConfirmId(id);
      return;
    }
    try {
      await deleteProduct(id);
      toast.success("Producto eliminado.");
      if (form.id === id) setForm(emptyForm);
      refetch();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setConfirmId(null);
    }
  }

  return (
    <div>
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="mb-1 font-mono text-[11px] uppercase tracking-widest text-accent">
            Panel / Productos
          </p>
          <h1 className="font-display text-2xl font-semibold tracking-tight">
            Productos del catálogo
          </h1>
        </div>
      </div>

      {!isEditing && (
        <div className="mb-6 border border-line bg-white p-6">
          <p className="mb-1 font-mono text-[11px] uppercase tracking-widest text-accent">
            Importar desde MakerWorld
          </p>
          <p className="mb-4 font-body text-[13px] text-steel">
            MakerWorld bloquea los pedidos automáticos desde servidores
            (Cloudflare), así que la importación se hace desde tu propio
            navegador con este botón: arrastralo a tu barra de marcadores una
            sola vez.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <a
              ref={bookmarkletRef}
              onClick={(e) => e.preventDefault()}
              draggable
              className="cursor-grab select-none rounded-full bg-ink px-6 py-3 font-mono text-[13px] uppercase tracking-wide text-paper transition-colors hover:bg-accent active:cursor-grabbing"
            >
              ⚙ Importar a OttoLab
            </a>
            <p className="font-mono text-[11px] text-steel">
              Arrastrá este botón a la barra de marcadores del navegador
            </p>
          </div>
          <p className="mt-4 font-body text-[13px] text-steel">
            Después, cuando estés viendo un modelo en MakerWorld, hacé click
            en el marcador — se abre esta página con el nombre, la
            descripción y la imagen ya cargados.
          </p>

          <details className="mt-4">
            <summary className="cursor-pointer font-mono text-[11px] uppercase tracking-wide text-steel hover:text-ink">
              ¿No podés arrastrarlo? Crealo a mano
            </summary>
            <div className="mt-3 flex flex-col gap-2">
              <p className="font-body text-[13px] text-steel">
                Creá un marcador nuevo en tu navegador (click derecho en la
                barra de marcadores → "Agregar página" o similar), poné
                cualquier nombre, y pegá esto en el campo URL/dirección:
              </p>
              <textarea
                readOnly
                rows={3}
                value={bookmarkletHref}
                onFocus={(e) => e.target.select()}
                className="border border-line bg-paper px-3 py-2 font-mono text-[11px] text-steel outline-none focus:border-accent"
              />
            </div>
          </details>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="mb-10 flex flex-col gap-5 border border-line bg-white p-6"
      >
        {isEditing && (
          <p className="font-mono text-[11px] uppercase tracking-widest text-accent">
            Editando: {form.name}
          </p>
        )}

        {form.image_url && (
          <div className="flex items-center gap-4 border border-line bg-paper p-3">
            <img
              src={form.image_url}
              alt=""
              className="h-16 w-16 flex-none border border-line object-cover"
            />
            <div className="flex-1">
              <p className="font-mono text-[11px] text-steel">
                Vista previa de la imagen cargada
              </p>
              {form.image_url.includes("makerworld") && (
                <p className="mt-1 font-mono text-[11px] text-accent">
                  Esta imagen todavía apunta a MakerWorld — descargala para
                  no depender de ese link.
                </p>
              )}
            </div>
            {form.makerworld_url.trim() && (
              <button
                type="button"
                disabled={downloadingImage}
                onClick={async () => {
                  setDownloadingImage(true);
                  try {
                    const res = await downloadProductImage(form.image_url);
                    setForm((f) => ({ ...f, image_url: res.image_url }));
                    toast.success("Imagen guardada en tu propio servidor.");
                  } catch (err) {
                    toast.error(err.message);
                  } finally {
                    setDownloadingImage(false);
                  }
                }}
                className="flex-none rounded-full border border-line px-4 py-2 font-mono text-[11px] uppercase tracking-wide text-steel transition-colors hover:border-ink hover:text-ink disabled:opacity-50"
              >
                {downloadingImage ? "Descargando..." : "Descargar a mi servidor"}
              </button>
            )}
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Nombre" name="name" value={form.name} onChange={handleChange} required />
          <Field
            label="Precio"
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            required
          />
        </div>

        <label className="flex flex-col gap-1">
          <span className="font-mono text-[11px] uppercase tracking-wide text-steel">
            Descripción
          </span>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="border border-line px-4 py-3 font-body text-ink outline-none focus:border-accent"
          />
        </label>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="flex flex-col gap-1">
            <span className="font-mono text-[11px] uppercase tracking-wide text-steel">
              Categoría
            </span>
            <select
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
              className="border border-line bg-white px-4 py-3 font-body text-ink outline-none focus:border-accent"
            >
              <option value="">Sin categoría</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <Field
            label="URL de imagen"
            name="image_url"
            value={form.image_url}
            onChange={handleChange}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="flex flex-col gap-1">
            <span className="font-mono text-[11px] uppercase tracking-wide text-steel">
              Sección
            </span>
            <select
              name="section_id"
              value={form.section_id}
              onChange={handleChange}
              className="border border-line bg-white px-4 py-3 font-body text-ink outline-none focus:border-accent"
            >
              <option value="">Sin sección</option>
              {sections.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
          <Field label="Material" name="material" value={form.material} onChange={handleChange} />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Tiempo de impresión estimado"
            name="estimated_print_time"
            value={form.estimated_print_time}
            onChange={handleChange}
            placeholder="Ej: 4 horas"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Diseñador / autor original"
            name="designer_name"
            value={form.designer_name}
            onChange={handleChange}
            placeholder="Ej: nombre del creador en MakerWorld"
          />
          <Field
            label="Link de MakerWorld"
            name="makerworld_url"
            type="url"
            value={form.makerworld_url}
            onChange={handleChange}
          />
        </div>

        {form.makerworld_url.trim() && (
          <div className="border border-line bg-paper p-4">
            <p className="mb-1 font-mono text-[11px] uppercase tracking-widest text-accent">
              Licencia de este modelo
            </p>
            <p className="mb-3 font-body text-[13px] text-steel">
              No decidimos esto automáticamente. Abrí el link de arriba,
              buscá la licencia del modelo en la página, y marcá vos lo que
              dice — pegá el texto exacto abajo para tener respaldo.
            </p>

            <label className="flex flex-col gap-1">
              <span className="font-mono text-[11px] uppercase tracking-wide text-steel">
                Estado
              </span>
              <select
                name="license_status"
                value={form.license_status}
                onChange={handleChange}
                className="border border-line bg-white px-4 py-3 font-body text-ink outline-none focus:border-accent"
              >
                {LICENSE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="mt-3 flex flex-col gap-1">
              <span className="font-mono text-[11px] uppercase tracking-wide text-steel">
                Texto de la licencia (pegalo tal cual)
              </span>
              <textarea
                name="license_notes"
                value={form.license_notes}
                onChange={handleChange}
                rows={2}
                placeholder="Ej: uso personal, no comercial, requiere atribución..."
                className="border border-line px-4 py-3 font-body text-ink outline-none focus:border-accent"
              />
            </label>

            {form.license_status === "personal_no_vender" && (
              <p className="mt-3 font-mono text-[11px] text-steel">
                ⚠ Con este estado, no vas a poder dejarlo "Visible en el
                catálogo público" más abajo.
              </p>
            )}
          </div>
        )}

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="active"
            checked={form.active}
            onChange={handleChange}
            className="h-4 w-4 border-line accent-[var(--color-accent)]"
          />
          <span className="font-mono text-[11px] uppercase tracking-wide text-steel">
            Visible en el catálogo público
          </span>
        </label>

        <div className="flex gap-3">
          {isEditing && (
            <button
              type="button"
              onClick={cancelEdit}
              className="rounded-full border border-line px-5 py-3 font-mono text-[13px] uppercase tracking-wide text-steel transition-colors hover:border-ink hover:text-ink"
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-ink px-6 py-3 font-mono text-[13px] uppercase tracking-wide text-paper transition-colors hover:bg-accent disabled:opacity-50"
          >
            {saving ? "Guardando..." : isEditing ? "Guardar cambios" : "Crear producto"}
          </button>
        </div>
      </form>

      {loading && <Loader label="Cargando productos..." />}

      {!loading && error && <EmptyState title="No pudimos cargar los productos" description={error} />}

      {!loading && !error && products.length === 0 && (
        <EmptyState
          title="Todavía no hay productos"
          description="Creá el primero con el formulario de arriba."
        />
      )}

      {!loading && !error && products.length > 0 && (
        <div className="overflow-x-auto border border-line bg-white">
          <table className="w-full min-w-[720px] text-left">
            <thead>
              <tr className="border-b border-line">
                <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-wide text-steel">
                  Nombre
                </th>
                <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-wide text-steel">
                  Categoría
                </th>
                <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-wide text-steel">
                  Precio
                </th>
                <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-wide text-steel">
                  Origen
                </th>
                <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-wide text-steel">
                  Licencia
                </th>
                <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-wide text-steel">
                  Estado
                </th>
                <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-wide text-steel">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-line last:border-b-0">
                  <td className="px-4 py-3 font-display text-[15px] font-medium">{p.name}</td>
                  <td className="px-4 py-3 font-mono text-[13px] text-steel">
                    {p.category_name || "—"}
                  </td>
                  <td className="px-4 py-3 font-mono text-[13px]">
                    ${Number(p.price).toLocaleString("es-AR")}
                  </td>
                  <td className="px-4 py-3 font-mono text-[12px] text-steel">
                    {p.makerworld_url ? (
                      <a
                        href={p.makerworld_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-accent underline underline-offset-2 hover:text-ink"
                      >
                        MakerWorld
                      </a>
                    ) : (
                      "Propio"
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {p.makerworld_url ? (
                      <LicenseBadge status={p.license_status} />
                    ) : (
                      <span className="font-mono text-[11px] text-steel">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`font-mono text-[11px] uppercase tracking-wide ${
                        p.active ? "text-ink" : "text-steel"
                      }`}
                    >
                      {p.active ? "Activo" : "Oculto"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-4">
                      <button
                        onClick={() => startEdit(p)}
                        className="font-mono text-[12px] uppercase tracking-wide text-accent underline underline-offset-2 hover:text-ink"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        onBlur={() => setConfirmId(null)}
                        className="font-mono text-[12px] uppercase tracking-wide text-steel underline underline-offset-2 hover:text-ink"
                      >
                        {confirmId === p.id ? "¿Confirmar?" : "Eliminar"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Field({ label, name, value, onChange, type = "text", required = false, ...rest }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="font-mono text-[11px] uppercase tracking-wide text-steel">{label}</span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="border border-line px-4 py-3 font-body text-ink outline-none focus:border-accent"
        {...rest}
      />
    </label>
  );
}

function LicenseBadge({ status }) {
  const map = {
    sin_revisar: { label: "Sin revisar", className: "text-steel" },
    personal_no_vender: { label: "No se puede vender", className: "text-ink font-semibold" },
    permite_venta: { label: "Permite venta", className: "text-accent" },
    licencia_comercial: { label: "Lic. comercial", className: "text-accent" },
  };
  const cfg = map[status] || map.sin_revisar;

  return (
    <span className={`font-mono text-[11px] uppercase tracking-wide ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}
