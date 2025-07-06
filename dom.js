// const toggleBtn = document.getElementById("toggle-btn");
// const icon = document.getElementById("icon");
// const body = document.getElementById("body");

// toggleBtn.addEventListener("click", () => {
//   body.classList.toggle("dark-mode");

//   if (body.classList.contains("dark-mode")) {
//     icon.textContent = "🐍";
//   } else {
//     icon.textContent = "🦋";
//   }
// });


// setTimeout(function(){
//   console.log("hi welcome to the website");
// },1000);
// setInterval(function(){
//   console.log("hi here! ");
// },1000);

// let API="https://fakestoreapi.com/products/category/jewelery";
// function getData()
// {
//   let res=fetch(API);  //data fetched in promise //we get pending so
//   res.then(function(data){
//     let res2=data.json(); //again returns promise
//     res2.then(function(data)
//     {
//       console.log(data);
//     });
//     res2.catch(function(data)
//     {
//      console.log(err);
//     });
//   });
//   res.catch(function(err)
//   {
//     console.log(err);
//   });
//   console.log(res);
// }

// getData();


//using async and await 

        // const API = "https://fakestoreapi.com/products";
        // const container = document.getElementById('products-container');

        // function getData() {
        //     fetch(API)
        //         .then(function(response) {
        //             if (!response.ok) {
        //                 throw new Error('Network response was not ok');
        //             }
        //             return response.json();
        //         })
        //         .then(function(products) {
        //             displayProducts(products);
        //         })
        //         .catch(function(error) {
        //             container.className = 'error';
        //             container.textContent = 'Failed to load products: ' + error.message;
        //             console.error('Error:', error);
        //         });
        // }

        // function displayProducts(products) {
        //     if (!products || products.length === 0) {
        //         container.className = 'error';
        //         container.textContent = 'No products found';
        //         return;
        //     }

        //     container.className = 'products-container';
        //     container.innerHTML = '';

        //     products.forEach(product => {
        //         const card = document.createElement('div');
        //         card.className = 'product-card';
        //         card.innerHTML = `
        //             <img src="${product.image}" alt="${product.title}" class="product-image">
        //             <div class="product-title" title="${product.title}">${product.title}</div>
        //             <div class="product-price">$${product.price}</div>
        //             <div class="product-rating">
        //                 Rating: ${product.rating.rate} (${product.rating.count} reviews)
        //             </div>
        //             <div class="product-category">${product.category}</div>
        //         `;
                
        //         container.appendChild(card);
        //     });
        // }

        // // Load data when page loads
        // document.addEventListener('DOMContentLoaded', getData);

// const apiKey = "0edf63c143df47d2b0d74154250207";
// const city = "Hyderabad";
// const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;

// async function getData() {
//   try {
//     const res = await axios.get(url);
//     const data = res.data;

//     const location = data.location.name + ", " + data.location.region;
//     const temp = data.current.temp_c + "°C";
//     const condition = data.current.condition.text;

//     document.getElementById("weather").innerHTML = `
//       <p><strong>Location:</strong> ${location}</p>
//       <p><strong>Temperature:</strong> ${temp}</p>
//       <p><strong>Condition:</strong> ${condition}</p>
//     `;
//   } catch (err) {
//     document.getElementById("weather").innerText = "Failed to fetch weather data.";
//   }
// }

// getData();

const apiKey = "0edf63c143df47d2b0d74154250207";

async function getData() {
  const city = document.getElementById("cityInput").value || "Hyderabad";
  const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;

  try {
    const res = await axios.get(url);
    const data = res.data;

    const location = `${data.location.name}, ${data.location.region}`;
    const temp = `${data.current.temp_c}°C`;
    const feelslike = `${data.current.feelslike_c}°C`;
    const condition = data.current.condition.text;
    const iconUrl = `https:${data.current.condition.icon}`;
    const humidity = `${data.current.humidity}%`;
    const wind = `${data.current.wind_kph} km/h`;

    document.getElementById("weather").innerHTML = `
      <h2>${location}</h2>
      <img src="${iconUrl}" alt="Weather Icon">
      <p>Condition: <strong>${condition}</strong></p>
      <p>Temperature: <strong>${temp}</strong></p>
      <p>Feels Like: <strong>${feelslike}</strong></p>
      <p>Humidity: <strong>${humidity}</strong></p>
      <p>Wind Speed: <strong>${wind}</strong></p>
    `;
  } catch (err) {
    document.getElementById("weather").innerText = "Invalid city or network error.";
  }
}


