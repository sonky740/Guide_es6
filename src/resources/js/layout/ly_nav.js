const lyNav = () => {
  const trigger = document.querySelector('.ly-nav-bar');
  const target = document.querySelector('.ly-nav-content');

  function show() {
    trigger.classList.add('on');
    target.classList.remove('hidden');
    target.classList.add('shown');
    target.classList.add('on');

    target.addEventListener('animationend', function () {
      if (target.classList.contains('on')) {
        target.classList.remove('on');
      }
    });
  }

  function hide() {
    trigger.classList.remove('on');
    target.classList.add('off');

    target.addEventListener('animationend', function () {
      if (target.classList.contains('off')) {
        target.classList.remove('off');
        target.classList.remove('shown');
      }
    });
  }

  trigger.addEventListener('click', function () {
    if (target.classList.contains('shown')) {
      hide();
    } else {
      show();
    }
  });
};

export default lyNav;
