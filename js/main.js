/*********************************************************************************
* WEB422 – Assignment 2
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: Simon Lam, Student ID: 150595197, Date: 02/05/2021
*
*
********************************************************************************/

var restaurantData = [];
var currentRestaurant = {};
// keeps track of the current page the user is viewing
var page = 1;
// number of restaurant items viewed on each page
const perPage = 10;
var map = null;

// calculates the average score given an array of grades
function avg(grades){
    var sum = 0;
    for(let i=0;i<grades.length;i++){
        sum += grades[i].score;
    }
    var avg = sum/grades.length;
    return avg.toFixed(2);
}

const tableRows = _.template(
    `<% _.forEach(restaurantData, function(restaurant){ %>
        <tr data-id=<%- restaurant._id %>>
        <td><%- restaurant.name %></td>
        <td><%- restaurant.cuisine %></td>
        <td><%- restaurant.address.building %> <%- restaurant.address.street %></td>
        <td><%- avg(restaurant.grades) %></td>
        </tr>
    <% }); %>`
    );

function loadRestaurantData(){
    fetch(`https://floating-basin-59373.herokuapp.com/api/restaurants?page=${page}&perPage=${perPage}`)
    .then(response => response.json())
    .then(data => {
        restaurantData = data;
        var rows = tableRows(restaurantData);
        $("#restaurant-table tbody").html(rows);
        $("#current-page").html(page);
    })
}

// click event for all tr elements within the tbody of the restaurant-table
$("#restaurant-table tbody").on("click", "tr", function(){
    let clickedId = $(this).attr("data-id");
    currentRestaurant = _.filter(restaurantData, function(restaurant){
        return restaurant._id==clickedId;
    });
    $(".modal-title").html(currentRestaurant[0].name);
    $("#restaurant-address").html(currentRestaurant[0].address.building + " " + currentRestaurant[0].address.street);
    $("#restaurant-modal").modal("show");
});

// click event for the previous page pagination button
$("#previous-page").on("click", function(){
    if(page>1){
        page--;
        loadRestaurantData();
    }
});

// click event for the next page pagination button
$("#next-page").on("click", function(){
    page++;
    loadRestaurantData();
});

// shown.bs.modal event for the Restaurant modal window
$('#restaurant-modal').on('shown.bs.modal', function () {
    map = new L.Map('leaflet', {
        center: [currentRestaurant[0].address.coord[1], currentRestaurant[0].address.coord[0]],
        zoom: 18,
        layers: [
        new L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
        ]
       });
       L.marker([currentRestaurant[0].address.coord[1], currentRestaurant[0].address.coord[0]]).addTo(map);
});

// hidden.bs.modal event for the Restaurant modal window
$('#restaurant-modal').on('hidden.bs.modal', function () {
    map.remove();
});

$(function(){
    loadRestaurantData();
});