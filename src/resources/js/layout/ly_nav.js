const lyNav = () => {
  const trigger = document.querySelector('.ly-nav-bar');
  const target = document.querySelector('.ly-nav-content');
  const navList = document.querySelectorAll('.ly-nav-content-list li a');
  const url = window.location.href.split('/');
  const urlLast = url[url.length - 1].split('.html')[0];

  navList.forEach(el => {
    if (el.innerHTML.toLocaleLowerCase() === urlLast) el.classList.add('on');
  });

  function show() {
    trigger.classList.add('on');
    target.classList.remove('hidden');
    target.classList.add('on');
  }

  function hide() {
    trigger.classList.remove('on');
    target.classList.remove('on');
    target.classList.add('off');

    target.addEventListener('animationend', function () {
      target.classList.remove('off');
    });
  }

  trigger.addEventListener('click', function () {
    if (target.classList.contains('on')) {
      hide();
    } else {
      show();
    }
  });
};

export default lyNav;
