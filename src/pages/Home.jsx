import Hero from "../components/Hero";
import RecentStrip from "../components/RecentStrip";
import CategorySection from "../components/CategorySection";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import useCategories from "../hooks/useCategories";
import useProducts from "../hooks/useProducts";

export default function Home() {
  const { categories, loading: loadingCategories, error: categoriesError } = useCategories();
  const { products, loading: loadingProducts, error: productsError } = useProducts();

  const loading = loadingCategories || loadingProducts;
  const error = categoriesError || productsError;

  return (
    <main>
      <Hero />

      {loading && <Loader label="Cargando catálogo..." />}

      {!loading && error && (
        <EmptyState
          title="No pudimos cargar el catálogo"
          description={error}
        />
      )}

      {!loading && !error && (
        <>
          <RecentStrip products={products.slice(0, 8)} />

          {categories.map((c) => (
            <CategorySection
              key={c.id}
              category={c}
              products={products.filter((p) => p.category_id === c.id)}
            />
          ))}

          {products.length === 0 && (
            <EmptyState
              title="Todavía no hay productos cargados"
              description="Muy pronto vas a encontrar acá el catálogo completo."
            />
          )}
        </>
      )}
    </main>
  );
}