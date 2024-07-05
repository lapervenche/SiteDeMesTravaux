// lancement du script de recherche d'IP
function add_data(data) {
  console.log(data);
// mise en page du script
  var table = document.getElementById("resultats");
  var tr = document.createElement('tr');   
  var ip = document.createElement('td');
  ip.innerHTML = data.ip
  var country = document.createElement('td');
  country.innerHTML = data.country
  var city = document.createElement('td');
  city.innerHTML = data.city
  var org = document.createElement('td');
// ordre de recherche
  org.innerHTML = data.org
  tr.appendChild(ip);
  tr.appendChild(country);
  tr.appendChild(city);
  tr.appendChild(org);
// tr.appendChild(remove);
  table.appendChild(tr);
  document.body.appendChild(table);
}
// envoi d'une requète de recherche d'IP
function ip_search() {
  var ip = document.getElementById("Recherche").value;
  console.log(ip);
  var url = `https://ipinfo.io/${ip}`;
  console.log(url);
// visualisation du résultat obtenu
  $.ajax({
    url: url,
    type: "GET",
    dataType: "json",
    async: false,
    success: function(data) {
      add_data(data);
    }
  });
}
