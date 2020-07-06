//59.921104 | Longitude: 30.359772
this.dancemap.formstep = (function(){
  let self = this;

  function setUppy(debug) {
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
      uppy.use(Uppy.XHRUpload, {
        endpoint: getEndpoint(debug),
        headers: getHeaders()
      })

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

  function getEndpoint(debug) {
    let endpoint = debug ? 'http://localhost:8080/upload' : 'https://dancemap.online/upload';
    //return 'https://dancemap.online/upload';
    return 'http://localhost:8080/upload';
  }
  function getHeaders() {
    const csrf = document.querySelector('meta[name="csrf-token"]').getAttribute('content');    
    const headers = {
      "CSRF-Token": csrf
    }
    return headers;
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
    setDates();
    setMarkerTypeListener();
    setDebugListener();
    setFormListener();
  }

  function setDates() {
  	let form = self.dancemap.formstep.form;

    form.start.valueAsDate = new Date();
    form.end.valueAsDate = new Date();
  }


  function changeMarkerType(event) {
  	let form = self.dancemap.formstep.form;
    let eventBlock = form.querySelector('#eventBlock');
    if(this.value === 'event' ) {
      eventBlock.style.display = 'block';
      form.start.disabled = false;
      form.end.disabled = false;
    } else if ( this.value === 'studio' ) {
      eventBlock.style.display = 'none';
      form.start.disabled = true;
      form.end.disabled = true;
    }  
  }

  function setMarkerTypeListener () {
  	let form = self.dancemap.formstep.form;
    let radios = form.querySelectorAll('input[type=radio][name="recordType"]'); 
    Array.prototype.forEach.call(radios, function(radio) {
      radio.addEventListener('change', changeMarkerType);
    });  	
  }


  function setDebugListener() {
  	let form = self.dancemap.formstep.form;
  	let debug = form.debug;
    debug.addEventListener('change', submitDebugColor);
  }

  
  function submitDebugColor(event) {
  	let form = self.dancemap.formstep.form;
    let submit = form.submit;

    if(this.checked) {
      //submit.style.backgroundColor = "#F20505";
      submit.classList.remove("blue-bg");
      submit.classList.add("red-bg");
    } else {
      //submit.style.backgroundColor = "#4c90cc";
      submit.classList.remove("red-bg");
      submit.classList.add("blue-bg");
    }  
  }

  function setFormListener () {
  	let form = self.dancemap.formstep.form;
    form.addEventListener("submit", formDataAggregation)	
  }


  function formDataAggregation(e) {
    let dancemap = self.dancemap;

    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Array
      .from(formData.entries())
      .reduce((memo, pair) => ({...memo, [pair[0]]:pair[1],}), {});
    data.token = Cookies.get('token');
    
    if(formData.getAll('offer').length) {
      data.offers = formData.getAll('offer')
      .map(el => {
        if(el) return JSON.parse(el);
        return null;
      })
      .filter(el => el !== null)
    }

    if(formData.getAll('activity').length) {
      let checkedValue = {}; 
      let inputElements = document.getElementsByName('activity');
      for(let i=0; inputElements[i]; ++i) {
        if(inputElements[i].checked) {
          let field = inputElements[i].value;
           checkedValue[field] = true;
        }   
      }
      data.activities = checkedValue;
    }

    if(formData.getAll('course').length) {
      let checkedValue = {}; 
      let inputElements = document.getElementsByName('course');
      for(let i=0; inputElements[i]; ++i) {
        if(inputElements[i].checked) {
          let field = inputElements[i].value;
           checkedValue[field] = true;
        }   
      }
      data.courses = checkedValue;
    }
    
    if(!dancemap.util.isObjEmpty(data)) {
       if(data.start) data.start = dancemap.util.getFormattedDate(data.start,{h:11,m:0,s:0});
       if(data.end) data.end = dancemap.util.getFormattedDate(data.end, {h:18,m:0,s:0});

       if(dancemap.formstep.form.uploads) data.uploads =  dancemap.formstep.form.uploads;

       console.log('data from form', data);

       if(dancemap.util.isObjPropNotEmpty(data) && !data.debug) {
          if(data.recordType === 'studio') dancemap.socket.postStudio(data);
          if(data.recordType === 'event') dancemap.socket.postEvent(data);
       }
       return; 
    }
    else console.error('form data is empty');

  }

  return {
    setForm : setForm,
    setUppy : setUppy,
    submitForm : submitForm,
    setFormData : setFormData
  }

})();




