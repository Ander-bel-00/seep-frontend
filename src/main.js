const handleContentMovement = (showNav) => {
  const content = document.querySelector('.content');

  if (content) {
      if (showNav) {
          content.style.marginLeft = '298px'; 
      } else {
          content.style.marginLeft = '';
      }
  }
};

export default handleContentMovement;