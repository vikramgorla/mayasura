import { describe, it, expect } from 'vitest';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToastProvider, useToast } from '@/components/ui/toast';

// Helper component to trigger toasts programmatically
function ToastTrigger() {
  const toast = useToast();

  return (
    <div>
      <button onClick={() => toast.success('Success!', 'It worked')}>Success</button>
      <button onClick={() => toast.error('Error!', 'Something failed')}>Error</button>
      <button onClick={() => toast.info('Info!', 'Just FYI')}>Info</button>
      <button onClick={() => toast.warning('Warning!', 'Watch out')}>Warning</button>
    </div>
  );
}

function renderToasts() {
  return render(
    <ToastProvider>
      <ToastTrigger />
    </ToastProvider>
  );
}

describe('Toast', () => {
  it('renders a success toast when triggered', async () => {
    const user = userEvent.setup();
    renderToasts();
    await user.click(screen.getByText('Success'));
    expect(screen.getByText('Success!')).toBeInTheDocument();
    expect(screen.getByText('It worked')).toBeInTheDocument();
  });

  it('renders an error toast', async () => {
    const user = userEvent.setup();
    renderToasts();
    await user.click(screen.getByText('Error'));
    expect(screen.getByText('Error!')).toBeInTheDocument();
    expect(screen.getByText('Something failed')).toBeInTheDocument();
  });

  it('renders an info toast', async () => {
    const user = userEvent.setup();
    renderToasts();
    await user.click(screen.getByText('Info'));
    expect(screen.getByText('Info!')).toBeInTheDocument();
    expect(screen.getByText('Just FYI')).toBeInTheDocument();
  });

  it('renders a warning toast', async () => {
    const user = userEvent.setup();
    renderToasts();
    await user.click(screen.getByText('Warning'));
    expect(screen.getByText('Warning!')).toBeInTheDocument();
    expect(screen.getByText('Watch out')).toBeInTheDocument();
  });

  it('can show multiple toasts', async () => {
    const user = userEvent.setup();
    renderToasts();
    await user.click(screen.getByText('Success'));
    await user.click(screen.getByText('Error'));
    expect(screen.getByText('Success!')).toBeInTheDocument();
    expect(screen.getByText('Error!')).toBeInTheDocument();
  });

  it('throws error when useToast is used outside provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    function BadComponent() {
      useToast();
      return null;
    }

    expect(() => render(<BadComponent />)).toThrow(
      'useToast must be used within a ToastProvider'
    );

    spy.mockRestore();
  });

  it('auto-dismisses toasts after timeout', async () => {
    renderToasts();

    // Use real timers — click to create toast
    const user = userEvent.setup();
    await user.click(screen.getByText('Success'));
    expect(screen.getByText('Success!')).toBeInTheDocument();

    // Wait for real auto-dismiss (4000ms default + buffer)
    await waitFor(
      () => {
        expect(screen.queryByText('Success!')).not.toBeInTheDocument();
      },
      { timeout: 6000 }
    );
  }, 10000); // 10s timeout for this test
});
