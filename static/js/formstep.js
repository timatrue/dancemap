//59.921104 | Longitude: 30.359772
this.dancemap.formstep = (function(){
  let self = this;

  function setNextListener(el) {
  	let dancemap = self.dancemap;
    el.addEventListener('click', function (event) {
      nextTab(1);
    });
  }

  function setPrevListener(el) {
  	let dancemap = self.dancemap;
    el.addEventListener('click', function (event) {
      nextTab(-1);
    });
  }

  function nextTab(nextTab) {
  	let formstep = self.dancemap.formstep;
  	let activeTab = formstep.activeTab;
  	let currentTab = activeTab + nextTab;
    formstep.tabs[activeTab].style.display = 'none';
    formstep.tabs[currentTab].style.display = 'block';
    formstep.activeTab = currentTab;
    navVisibility(currentTab);
  }

  function navVisibility(currentTab) {
  	let formstep = self.dancemap.formstep;
    if (currentTab == 0) {
      formstep.prev.style.display = "none";
    } else {
      formstep.prev.style.display = "inline";
    }
    if (currentTab == (formstep.tabs.length - 1)) {
      formstep.next.style.display = "none";
    } else {
      formstep.next.style.display = "inline";
    } 

  }

  function getFormState() {

  }

  function submitForm() {
  	let uppy = self.dancemap.formstep.uppy;
  	uppy.upload().then((result) => {
      console.info('Successful uploads:', result.successful)

	  if (result.failed.length > 0) {
	    console.error('Errors:')
	    result.failed.forEach((file) => {
	      console.error(file.error)
	    })
	  }
    })

  }

  function showTab() {
  	let dancemap = self.dancemap;
  	let currentTab = dancemap.formstep.activeTab;
    dancemap.formstep.tabs[currentTab].style.display = 'block';
    navVisibility(currentTab);
  }

  function setForm(settings) {
  	let dancemap = self.dancemap;
    dancemap.formstep.next = settings.next;
    dancemap.formstep.prev = settings.prev;
    dancemap.formstep.tabs = settings.tabs;
    dancemap.formstep.activeTab = settings.activeTab;
    dancemap.formstep.limitTab = settings.tabs.length;
    showTab();
    setNextListener(dancemap.formstep.next);
    setPrevListener(dancemap.formstep.prev);

  }
  
  return {
    setForm : setForm,
    submitForm : submitForm
  }

})();




