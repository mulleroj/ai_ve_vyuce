(() => {
  const navigation = document.querySelector('.article-content-navigation');
  if (!navigation || !('IntersectionObserver' in window)) return;

  const links = Array.from(navigation.querySelectorAll('a[href^="#"]'));
  const items = links.map(link => ({
    link,
    heading: document.getElementById(decodeURIComponent(link.hash.slice(1)))
  })).filter(item => item.heading);

  if (!items.length) return;

  const setCurrent = item => {
    for (const candidate of items) {
      if (candidate === item) {
        candidate.link.classList.add('is-current');
        candidate.link.setAttribute('aria-current', 'location');
      } else {
        candidate.link.classList.remove('is-current');
        candidate.link.removeAttribute('aria-current');
      }
    }
  };

  const initial = items.find(item => item.heading.id === decodeURIComponent(location.hash.slice(1))) || items[0];
  setCurrent(initial);

  const updateCurrent = () => {
    const marker = Math.min(window.innerHeight * 0.34, 240);
    const passed = items.filter(item => item.heading.getBoundingClientRect().top <= marker);
    setCurrent(passed[passed.length - 1] || items[0]);
  };

  const observer = new IntersectionObserver(updateCurrent, {
    rootMargin: '-18% 0px -66% 0px',
    threshold: 0
  });
  for (const item of items) observer.observe(item.heading);
})();
