'use client';

export function openLeadModal() {
  window.dispatchEvent(new CustomEvent('open-lead-modal'));
}

export function CourierButton({
  children = "Викликати кур'єра",
  className = 'btn btn-accent',
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <button type="button" className={className} onClick={openLeadModal}>
      {children}
    </button>
  );
}
