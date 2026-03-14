import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToastProvider, useToast } from '@/components/ui/toast';

// Helper component to trigger toasts
function ToastTrigger({ type, title, description }: { type: string; title: string; description?: string }) {
  const toast = useToast();

  const handleClick = () => {
    switch (type) {
      case 'success':
        toast.success(title, description);
        break;
      case 'error':
        toast.error(title, description);
        break;
      case 'info':
        toast.info(title, description);
        break;
      case 'warning':
        toast.warning(title, description);
        break;
      default:
        toast.toast({ type: 'info', title, description });
    }
  };

  return <button onClick={handleClick}>Trigger</button>;
}

function renderWithToast(type = 'success', title = 'Test Toast', description?: string) {
  return render(
    <ToastProvider>
      <ToastTrigger type={type} title={title} description={description} />
    </ToastProvider>
  );
}

describe('Toast', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders a success toast when triggered', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    renderWithToast('success', 'Save successful');
    await user.click(screen.getByText('Trigger'));
    expect(screen.getByText('Save successful')).toBeInTheDocument();
  });

  it('renders an error toast', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    renderWithToast('error', 'Something went wrong');
    await user.click(screen.getByText('Trigger'));
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('renders an info toast', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    renderWithToast('info', 'Info message');
    await user.click(screen.getByText('Trigger'));
    expect(screen.getByText('Info message')).toBeInTheDocument();
  });

  it('renders a warning toast', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    renderWithToast('warning', 'Be careful');
    await user.click(screen.getByText('Trigger'));
    expect(screen.getByText('Be careful')).toBeInTheDocument();
  });

  it('renders toast with description', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    renderWithToast('success', 'Saved', 'Your changes have been saved');
    await user.click(screen.getByText('Trigger'));
    expect(screen.getByText('Saved')).toBeInTheDocument();
    expect(screen.getByText('Your changes have been saved')).toBeInTheDocument();
  });

  it('auto-dismisses after timeout', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    renderWithToast('success', 'Will disappear');
    await user.click(screen.getByText('Trigger'));

    expect(screen.getByText('Will disappear')).toBeInTheDocument();

    // Advance past the 4000ms default duration
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(screen.queryByText('Will disappear')).not.toBeInTheDocument();
  });

  it('throws error when useToast is used outside provider', () => {
    // Suppress console.error for this test
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
});
