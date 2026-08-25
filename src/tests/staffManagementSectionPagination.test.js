/**
 * @vitest-environment jsdom
 *
 * Component tests for StaffManagementSection's Staff pagination:
 * - Desktop table uses real page-based pagination (currentPage/pageSize).
 * - Mobile card list uses its own independent "load more" pattern
 *   (mobileVisibleCount, starts at 15, grows by 15 per press).
 * - The two must stay decoupled (see AGENTS.md "Pagination" section).
 */
import { describe, it, expect, beforeAll, beforeEach, afterEach } from 'vitest';
import { h, render } from 'preact';
import { act } from 'preact/test-utils';
import StaffManagementSection from '../components/StaffManagementSection';

function buildStaff(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: `s-${i + 1}`,
    rowIndex: i + 2,
    name: `Staff Member ${i + 1}`,
    role: 'Bailarín',
    bio: '',
    photo: '',
    socialLinks: '',
    displayOrder: i + 1,
    isVisible: true,
  }));
}

function findByText(container, selector, text) {
  return [...container.querySelectorAll(selector)].find((el) => el.textContent.includes(text));
}

function click(el) {
  el.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true }));
}

describe('StaffManagementSection pagination', () => {
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
  });

  afterEach(() => {
    act(() => {
      render(null, container);
    });
    container.remove();
  });

  async function renderSection(count) {
    await act(async () => {
      render(h(StaffManagementSection, { staff: buildStaff(count), canEdit: true }), container);
    });
  }

  it('mobile card list loads 15 members initially and grows by 15 per "Cargar más" press', async () => {
    await renderSection(40);

    const mobileCards = () => container.querySelectorAll('.glass-card');
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
    await renderSection(40);

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
    expect(container.querySelectorAll('.glass-card').length).toBe(15);
  });

  it('renders a sticky mobile header for the Staff title/search bar', async () => {
    await renderSection(5);

    const heading = findByText(container, 'h2', 'Staff');
    const stickyWrapper = heading.closest('.sticky');
    expect(stickyWrapper).toBeTruthy();
    expect(stickyWrapper.className).toContain('top-0');
  });
});
