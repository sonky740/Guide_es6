const lyNav = () => {
  const trigger = document.querySelector('.ly-nav-bar') as HTMLElement;
  const target = document.querySelector('.ly-nav-content') as HTMLElement;
  const navList: NodeListOf<HTMLElement> = document.querySelectorAll('.comp-list li a');
  const url = window.location.href.split('/');
  const urlLast = url[url.length - 1].split('.html')[0];

  navList.forEach((el: HTMLElement) => {
    if (el.innerHTML.toLocaleLowerCase() === urlLast.toLocaleLowerCase()) el.classList.add('on');
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
