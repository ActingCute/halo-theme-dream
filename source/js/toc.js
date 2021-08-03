(function (window, document) {
  function register($toc) {
    // toc滚动时间和偏移量
    const time = 20
    const headingsOffset = 50
    const currentInView = new Set();
    const headingToMenu = new Map();
    const $menus = Array.from($toc.querySelectorAll('.menu-list > li > a'));

    for (const $menu of $menus) {
      const elementId = $menu.getAttribute('href').trim().slice(1);
      const $heading = document.getElementById(elementId);
      if ($heading) {
        headingToMenu.set($heading, $menu);
      }
    }

    const $headings = Array.from(headingToMenu.keys());

    const callback = (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          currentInView.add(entry.target);
        } else {
          currentInView.delete(entry.target);
        }
      }
      let $heading;
      if (currentInView.size) {
        // heading is the first in-view heading
        $heading = [...currentInView].sort(($el1, $el2) => $el1.offsetTop - $el2.offsetTop)[0];
      } else if ($headings.length) {
        // heading is the closest heading above the viewport top
        $heading = $headings
          .filter(($heading) => $heading.offsetTop < window.scrollY)
          .sort(($el1, $el2) => $el2.offsetTop - $el1.offsetTop)[0];
      }
      if ($heading && headingToMenu.has($heading)) {
        $menus.forEach(($menu) => $menu.classList.remove('is-active'));

        const $menu = headingToMenu.get($heading);
        $menu.classList.add('is-active');
        let $menuList = $menu.parentElement.parentElement;
        while (
          $menuList.classList.contains('menu-list') &&
          $menuList.parentElement.tagName.toLowerCase() === 'li'
        ) {
          $menuList.parentElement.children[0].classList.add('is-active');
          $menuList = $menuList.parentElement.parentElement;
        }
      }
    };
    const observer = new IntersectionObserver(callback, { threshold: 0 });

    for (const $heading of $headings) {
      observer.observe($heading);
      // smooth scroll to the heading
      if (headingToMenu.has($heading)) {
        const $menu = headingToMenu.get($heading);
        $menu.addEventListener('click', () => {
          var element = document.getElementById($menu.getAttribute("href").substring(1))
          let rect = element.getBoundingClientRect();
          let currentY = window.pageYOffset;
          let targetY = currentY + rect.top - headingsOffset;
          let speed = (targetY - currentY) / time;
          let offset = currentY > targetY ? -1 : 1;
          let requestId;
          function step(timestamp) {
            currentY+=speed;
            if(currentY * offset < targetY * offset){
              window.scrollTo(0,currentY);
              requestId=window.requestAnimationFrame(step);
            }else{
              window.scrollTo(0,targetY);
              window.cancelAnimationFrame(requestId);
            }
          }
          window.requestAnimationFrame(step);
        });
      }
      if (headingToMenu.has($heading)) {
        $heading.style.scrollMargin = '1em';
      }
    }
  }

  if (typeof window.IntersectionObserver === 'undefined') {
    return;
  }

  document.querySelectorAll('#toc').forEach(register);
})(window, document);
(function ($) {
  const $toc = $('#toc');
  if ($toc.length > 0) {
    const $mask = $('<div>');
    $mask.attr('id', 'toc-mask');

    $('body').append($mask);

    function toggleToc() { // eslint-disable-line no-inner-declarations
      $toc.toggleClass('is-active');
      $mask.toggleClass('is-active');
    }

    $toc.on('click', toggleToc);
    $mask.on('click', toggleToc);
    $('.navbar-main .catalogue').on('click', toggleToc);
  }
})(jQuery);
