const lyNav = () => {
  const trigger = document.querySelector('.ly-nav-bar');
  const target = document.querySelector('.ly-nav-content');

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
