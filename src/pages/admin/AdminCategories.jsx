import { useState } from "react";
import { toast } from "react-toastify";
import useCategories from "../../hooks/useCategories";
import { createCategory, updateCategory, deleteCategory } from "../../api/categories";
import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";

const emptyForm = { id: null, name: "" };

export default function AdminCategories() {
  const { categories, loading, error, refetch } = useCategories();
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [confirmId, setConfirmId] = useState(null);

  const isEditing = form.id !== null;

  function startEdit(category) {
    setForm({ id: category.id, name: category.name });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setForm(emptyForm);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) return;

    setSaving(true);
    try {
      if (isEditing) {
        await updateCategory(form.id, { name: form.name.trim() });
        toast.success("Categoría actualizada.");
      } else {
        await createCategory({ name: form.name.trim() });
        toast.success("Categoría creada.");
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
      await deleteCategory(id);
      toast.success("Categoría eliminada.");
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
            Panel / Categorías
          </p>
          <h1 className="font-display text-2xl font-semibold tracking-tight">
            Categorías del catálogo
          </h1>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mb-10 flex flex-col gap-4 border border-line bg-white p-6 sm:flex-row sm:items-end"
      >
        <label className="flex flex-1 flex-col gap-1">
          <span className="font-mono text-[11px] uppercase tracking-wide text-steel">
            {isEditing ? "Editando categoría" : "Nombre de la categoría"}
          </span>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            placeholder="Ej: Llaveros"
            className="border border-line px-4 py-3 font-body outline-none focus:border-accent"
          />
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
            {saving ? "Guardando..." : isEditing ? "Guardar cambios" : "Crear categoría"}
          </button>
        </div>
      </form>

      {loading && <Loader label="Cargando categorías..." />}

      {!loading && error && <EmptyState title="No pudimos cargar las categorías" description={error} />}

      {!loading && !error && categories.length === 0 && (
        <EmptyState
          title="Todavía no hay categorías"
          description="Creá la primera arriba para empezar a organizar el catálogo."
        />
      )}

      {!loading && !error && categories.length > 0 && (
        <div className="border border-line bg-white">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-line">
                <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-wide text-steel">
                  Nombre
                </th>
                <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-wide text-steel">
                  Slug
                </th>
                <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-wide text-steel">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id} className="border-b border-line last:border-b-0">
                  <td className="px-4 py-3 font-display text-[15px] font-medium">{c.name}</td>
                  <td className="px-4 py-3 font-mono text-[13px] text-steel">{c.slug}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-4">
                      <button
                        onClick={() => startEdit(c)}
                        className="font-mono text-[12px] uppercase tracking-wide text-accent underline underline-offset-2 hover:text-ink"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        onBlur={() => setConfirmId(null)}
                        className="font-mono text-[12px] uppercase tracking-wide text-steel underline underline-offset-2 hover:text-ink"
                      >
                        {confirmId === c.id ? "¿Confirmar?" : "Eliminar"}
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
