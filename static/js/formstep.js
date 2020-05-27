//59.921104 | Longitude: 30.359772
this.dancemap.formstep = (function(){
  let self = this;

  function setUppy() {
  	let dancemap = self.dancemap;

    dancemap.formstep.uppy = Uppy.Core({
      restrictions: {
	    maxFileSize: 1048576,
	    maxNumberOfFiles: 3,
	    minNumberOfFiles: null,
	    allowedFileTypes: ['image/*', '.jpg', '.jpeg', '.png']
	  },
	  locale: {
        strings: {
	      youCanOnlyUploadX: {
	        0: 'You can only upload %{smart_count} file',
	        1: 'You can only upload %{smart_count} files'
	      },
          youHaveToAtLeastSelectX: {
            0: 'You have to select at least %{smart_count} file',
            1: 'You have to select at least %{smart_count} files'
          },
          // **NOTE**: This string is called `exceedsSize2` for backwards compatibility reasons.
          // See https://github.com/transloadit/uppy/pull/2077
          exceedsSize2: 'Размер файла превышает %{size}',
          youCanOnlyUploadFileTypes: 'Вы можете загружать только файлы: %{types}',
          companionError: 'Connection with Companion failed'
        }
      }
	});
    let uppy = dancemap.formstep.uppy;

      uppy.use(Uppy.Dashboard, {
        inline: true,
        locale: Uppy.locales.ru_RU,
        target: '#drag-drop-area',
        hideUploadButton: false,
        note: 'Изображения размером не больше 1 МБ'
      })
      //.use(Uppy.Form, {target: 'form'})
      //.use(Uppy.Tus, {endpoint: 'http://localhost:8080/upload'})
      //uppy.use(Uppy.XHRUpload, { endpoint: 'https://dancemap.online/upload' })
      uppy.use(Uppy.XHRUpload, { endpoint: 'http://localhost:8080/upload' })

      uppy.on('complete', (result) => {

      	let form = self.dancemap.formstep.form;

      	if(form.uploads) form.uploads.push(...result.successful);
      	else form.uploads = result.successful;

        form.nextBtn.disabled = false;
        form.nextBtn.classList.remove('disabled-bg')
        form.nextBtn.classList.add('blue-bg')


        console.log('Upload complete! We’ve uploaded these files:', result.successful)
      })
  }


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
  	let form = self.dancemap.formstep.form;
  	uppy.upload().then((result) => {

	  if (result.failed.length > 0) {
	    console.error('Errors:')
	    result.failed.forEach((file) => {
	      console.error(file.error)
	    })
	  } else {
        console.info('Successful uploads:', result.successful)
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
  
  function setFormData(settings) {
    let dancemap = self.dancemap;
    dancemap.formstep.form = settings.form;
    setDates()
  }

  function setDates() {
  	let form = self.dancemap.formstep.form;

    form.start.valueAsDate = new Date();
    form.end.valueAsDate = new Date();
  }

  return {
    setForm : setForm,
    setUppy : setUppy,
    submitForm : submitForm,
    setFormData : setFormData
  }

})();




