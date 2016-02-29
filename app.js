(function(){
   "use strict";

   var Moosipurk = function(){

     // SEE ON SINGLETON PATTERN
     if(Moosipurk.instance){
       return Moosipurk.instance;
     }
     //this viitab Moosipurk fn
     Moosipurk.instance = this;

     this.routes = Moosipurk.routes;
     // this.routes['home-view'].render()

     console.log('moosipurgi sees');

     // KõIK muuutujad, mida muudetakse ja on rakendusega seotud defineeritakse siin
     this.click_count = 0;
     this.currentRoute = null;
     console.log(this);

	 //siin hakkan hoidma kõiki purke
	 this.jars = [];

     // Kui tahan Moosipurgile referenci siis kasutan THIS = MOOSIPURGI RAKENDUS ISE
     this.init();
   };

   window.Moosipurk = Moosipurk; // Paneme muuutja külge

   Moosipurk.routes = {
     'home-view': {
       'render': function(){
         // käivitame siis kui lehte laeme
         console.log('>>>>avaleht');
       }
     },
     'list-view': {
       'render': function(){
         // käivitame siis kui lehte laeme
         console.log('>>>>loend');

         //simulatsioon laeb kaua
         window.setTimeout(function(){
           document.querySelector('.loading').innerHTML = 'laetud!';
         }, 3000);

       }
     },
     'manage-view': {
       'render': function(){
         // käivitame siis kui lehte laeme
       }
     }
   };

   // Kõik funktsioonid lähevad Moosipurgi külge
   Moosipurk.prototype = {

     init: function(){
       console.log('Rakendus läks tööle');

       //kuulan aadressirea vahetust
       window.addEventListener('hashchange', this.routeChange.bind(this));

       // kui aadressireal ei ole hashi siis lisan juurde
       if(!window.location.hash){
         window.location.hash = 'home-view';
         // routechange siin ei ole vaja sest käsitsi muutmine käivitab routechange event'i ikka
       }else{
         //esimesel käivitamisel vaatame urli üle ja uuendame menüüd
         this.routeChange();
       }

	   //saan kätte purgid localStorage'ist, kui on
	   if(localStorage.jars){
		   //võtan stringi ja teen tagasi objektideks
		   //this.jars = JSON.parse(localStorage.jars);
		   //console.log('laadisin localStorageist massiivi ' + this.jars.length);

		   this.createListFromArray(JSON.parse(localStorage.jars));
       console.log('laadisin localStorageist');


	   }else{

       var xhttp = new XMLHttpRequest();

       //vahetub siis, kui toimub muutus ühenduses
       xhttp.onreadystatechange = function() {

         console.log(xhttp.readyState);

         //fail jõudis tervenisti kohale
         if (xhttp.readyState == 4 && xhttp.status == 200) {

           var result = JSON.parse(xhttp.responseText);
           console.log(result);

           //NB! saab viidate MOOSIPURGILE ka Moosipurk.instance

           Moosipurk.instance.createListFromArray(result);
           console.log('laadisin serverist');

         }
       };
       xhttp.open("GET", "saveData.php", true);
       xhttp.send();



     }


       // esimene loogika oleks see, et kuulame hiireklikki nupul
       this.bindEvents();

     },

     createListFromArray: function(arrayOfObjects){

       this.jars = arrayOfObjects;

		   //tekitan loendi htmli
		   this.jars.forEach(function(jar){

			   var new_jar = new Jar(jar.title, jar.ingredients);
			   var li = new_jar.createHtmlElement();
			   var item = document.querySelector('.list-of-jars').appendChild(li);
			   item.innerHTML += " <input type='button' value='X' id='remove' >";
       });



     },

     bindEvents: function(){
       document.querySelector('.add-new-jar').addEventListener('click', this.addNewClick.bind(this));

	   //kuulan trükkimist otsikastis
	   document.querySelector('#search').addEventListener('keyup', this.search.bind(this));
	   document.querySelector('#remove').addEventListener('click', this.remove.bind(this));
     },




	 //SIIT TEE EDASI, et saaks elementi eemaldada
	 remove: function(){

	 },

	 search: function(event){
		 //otsikasti väärtus
		 var needle = document.querySelector('#search').value.toLowerCase();
		 console.log(needle);

		 var list = document.querySelectorAll('ul.list-of-jars li');
		 console.log(list);

		 for(var i=0; i <list.length; i++){
			 //ühe listitemi sisu tekst
			 var li = list[i];
			 var stack = li.querySelector('.content').innerHTML;

			 //kas otsisõna on sisus olemas
			 if(stack.indexOf(needle) !== -1){
				 //olemas
				 li.style.display = 'list-item';
			 }else{
				 //ei ole, indeks on -1
				 li.style.display = 'none';
			 }
		 }
	 },

     addNewClick: function(event){
       //salvestame purgi
       //console.log(event);

       var title = document.querySelector('.title').value;
       var ingredients = document.querySelector('.ingredients').value;

       //console.log(title + ' ' + ingredients);
       //1) tekitan uue Jar'i
       var new_jar = new Jar(title, ingredients);
	   console.log(new_jar);

	   //lisan massiivi purgi
	   this.jars.push(new_jar);
	   console.log(JSON.stringify(this.jars));
	   //JSONI stringina salvestan localStorage'isse
	   localStorage.setItem('jars', JSON.stringify(this.jars));

     //salvestan serverisse
     var xhttp = new XMLHttpRequest();
     xhttp.onreadystatechange = function() {
       if (xhttp.readyState == 4 && xhttp.status == 200) {
         console.log('salvestan selverisse');
       }
     };
     console.log("saveData.php?title=" + title +  "&ingredients=" + ingredients);
     xhttp.open("GET", "saveData.php?title=" + title +  "&ingredients=" + ingredients, true);
     xhttp.send();





       // 2) lisan selle htmli listi juurde
       var li = new_jar.createHtmlElement();
       document.querySelector('.list-of-jars').appendChild(li);


     },

     routeChange: function(event){

       //kirjutan muuutujasse lehe nime, võtan maha #
       this.currentRoute = location.hash.slice(1);
       console.log(this.currentRoute);

       //kas meil on selline leht olemas?
       if(this.routes[this.currentRoute]){

         //muudan menüü lingi aktiivseks
         this.updateMenu();

         this.routes[this.currentRoute].render();


       }else{
         /// 404 - ei olnud
       }


     },

     updateMenu: function() {
       //http://stackoverflow.com/questions/195951/change-an-elements-class-with-javascript
       //1) võtan maha aktiivse menüülingi kui on
       document.querySelector('.active-menu').className = document.querySelector('.active-menu').className.replace('active-menu', '');

       //2) lisan uuele juurde
       //console.log(location.hash);
       document.querySelector('.'+this.currentRoute).className += ' active-menu';

     }

   }; // MOOSIPURGI LõPP

   var Jar = function(new_title, new_ingredients){
     this.title = new_title;
     this.ingredients = new_ingredients;
     console.log('created new jar');
   };

   Jar.prototype = {
     createHtmlElement: function(){

       // võttes title ja ingredients ->
       /*
       li
        span.letter
          M <- title esimene täht
        span.content
          title | ingredients
       */

       var li = document.createElement('li');

       var span = document.createElement('span');
       span.classtitle = 'letter';

       var letter = document.createTextNode(this.title.charAt(0));
       span.appendChild(letter);

       li.appendChild(span);

       var span_with_content = document.createElement('span');
       span_with_content.classtitle = 'content';

       var content = document.createTextNode(this.title + ' | ' + this.ingredients);
       span_with_content.appendChild(content);

       li.appendChild(span_with_content);

       return li;

     }
   };

   // kui leht laetud käivitan Moosipurgi rakenduse
   window.onload = function(){
     var app = new Moosipurk();
   };

})();
