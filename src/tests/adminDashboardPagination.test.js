/**
 * @vitest-environment jsdom
 *
 * Component tests for AdminDashboard's Participantes pagination:
 * - Desktop table uses real page-based pagination (currentPage/pageSize).
 * - Mobile card list uses its own independent "load more" pattern
 *   (visibleCount, starts at 15, grows by 15 per press).
 * - The two must stay decoupled (see AGENTS.md "Pagination" section).
 */
import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from 'vitest';
import { h, render } from 'preact';
import { act } from 'preact/test-utils';
import AdminDashboard from '../components/AdminDashboard';
import { dashboardService } from '../services/dashboardService';
import { REGISTRATION_STATUS } from '../config/constants';

vi.mock('../services/dashboardService', () => ({
  dashboardService: {
    fetchRegistrations: vi.fn(),
    fetchStaff: vi.fn(),
  },
}));

function buildParticipants(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: `p-${i + 1}`,
    rowIndex: i + 2,
    name: `Participant ${i + 1}`,
    email: `p${i + 1}@example.com`,
    phone: '3000000000',
    house: 'House of Test',
    age: '20',
    status: REGISTRATION_STATUS.REGISTERED,
    timestamp: new Date().toISOString(),
  }));
}

function findByText(container, selector, text) {
  return [...container.querySelectorAll(selector)].find((el) => el.textContent.includes(text));
}

function click(el) {
  el.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true }));
}

describe('AdminDashboard Participantes pagination', () => {
  let container;

  beforeAll(() => {
    // jsdom does not implement matchMedia; ThemeToggle relies on it.
    if (!window.matchMedia) {
      window.matchMedia = (query) => ({
        matches: false,
        media: query,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
      });
    }
  });

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    dashboardService.fetchRegistrations.mockReset();
    dashboardService.fetchStaff.mockReset();
  });

  afterEach(() => {
    act(() => {
      render(null, container);
    });
    container.remove();
  });

  async function renderDashboard(count) {
    dashboardService.fetchRegistrations.mockResolvedValue(buildParticipants(count));
    dashboardService.fetchStaff.mockResolvedValue([]);
    await act(async () => {
      render(h(AdminDashboard, { user: { role: 'admin' } }), container);
    });
    // Flush the microtasks from the async loadDashboardData() call.
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });
  }

  it('mobile card list loads 15 items initially and grows by 15 per "Cargar más" press', async () => {
    await renderDashboard(40);

    const mobileCards = () => container.querySelectorAll('.glass-panel');
    expect(mobileCards().length).toBe(15);

    const loadMoreBtn = findByText(container, 'button', 'Cargar más');
    expect(loadMoreBtn).toBeTruthy();
    expect(loadMoreBtn.textContent).toContain('15 de 40');

    await act(async () => {
      click(loadMoreBtn);
    });

    expect(mobileCards().length).toBe(30);
  });

  it('desktop table paginates independently of the mobile "Cargar más" list', async () => {
    await renderDashboard(40);

    const rows = () => container.querySelectorAll('tbody tr');
    expect(rows().length).toBe(10); // default pageSize

    const mostrando = () => findByText(container, 'div', 'Mostrando');
    expect(mostrando().textContent).toContain('Mostrando 1-10 de 40');

    const pageButtons = () =>
      [...container.querySelectorAll('button')].filter((b) => /^[0-9]+$/.test(b.textContent.trim()));
    expect(pageButtons().length).toBe(4); // ceil(40/10)

    await act(async () => {
      click(pageButtons()[1]); // page "2"
    });

    expect(rows().length).toBe(10);
    expect(mostrando().textContent).toContain('Mostrando 11-20 de 40');

    // The mobile list must stay untouched by desktop page navigation.
    expect(container.querySelectorAll('.glass-panel').length).toBe(15);
  });

  it('renders a sticky mobile header for the Participantes title/search/filter bar', async () => {
    await renderDashboard(5);

    const heading = findByText(container, 'h2', 'Participantes');
    const stickyWrapper = heading.closest('.sticky');
    expect(stickyWrapper).toBeTruthy();
    expect(stickyWrapper.className).toContain('top-0');
  });

  it('does not let Participantes and Staff share a single scroll container on mobile', async () => {
    dashboardService.fetchRegistrations.mockResolvedValue(buildParticipants(40));
    dashboardService.fetchStaff.mockResolvedValue([
      { id: 's-1', rowIndex: 2, name: 'Staff One', role: 'Bailarín', displayOrder: 1, isVisible: true },
    ]);
    await act(async () => {
      render(h(AdminDashboard, { user: { role: 'admin' } }), container);
    });
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    // main must not be its own mobile scroll container — each tab owns its
    // own bounded overflow-y-auto region instead, so switching tabs can't
    // leak scrollTop from one list into the other.
    const main = container.querySelector('main');
    expect(main.className).not.toContain('overflow-y-auto');

    const participantsScroller = findByText(container, 'h2', 'Participantes')
      .closest('section')
      .querySelector('.overflow-y-auto');
    expect(participantsScroller).toBeTruthy();
    participantsScroller.scrollTop = 500;

    // Switch to the Staff tab.
    const staffTabButton = findByText(container, 'button', 'Staff');
    await act(async () => {
      click(staffTabButton);
    });

    const staffScroller = [...container.querySelectorAll('.overflow-y-auto')].find((el) =>
      el.querySelector('.glass-card')
    );
    expect(staffScroller).toBeTruthy();
    // A freshly-mounted, independent scroll container always starts at 0 —
    // it must not inherit the Participantes list's scroll position.
    expect(staffScroller.scrollTop).toBe(0);
  });
});
