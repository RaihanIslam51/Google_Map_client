// Utility helper to safely load SweetAlert2 in Next.js SSR & Client environment
export const showSwal = async (options) => {
  if (typeof window !== 'undefined') {
    const Swal = (await import('sweetalert2')).default;
    return Swal.fire(options);
  }
};
