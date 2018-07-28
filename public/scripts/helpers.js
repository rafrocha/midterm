// jshint esversion: 6
"use strict";

// Returns an object of unique items and quantities in an order
function countItems(items) {
  const counted = {};

  items.forEach(item => {
    counted[item.name] = counted[item.name] ? counted[item.name] + 1 : 1;
  });
  return counted;
}

// Creates an order element for each unique order
function createOrder(order, orderItems) {
  const $order = $("<div>").addClass("row admin-item-row");

  const $head = $("<div>").addClass("col-sm-12 col-xs-12 admin-item-head").appendTo($order);
  $("<h4>").attr({ customer: order.name }).text(`Order ${order.id} - ${order.name} - ${order.phone}`).appendTo($head);
  $("<p>").text(`Placed at: ${order.placed_at}`).appendTo($head);

  const $status = $("<div>").addClass("col-sm-12 col-xs-12 admin-item-status").appendTo($order);
  if (order.status === "Placed") {
    $('<h5 class="status"><span class="current">Placed</span> → Confirmed → Ready for Pickup</h5>').appendTo($status);
  } else if (order.status === "Confirmed") {
    $('<h5 class="status">Placed → <span class="current">Confirmed</span> → Ready for Pickup</h5>').appendTo($status);
  } else {
    $('<h5 class="status">Placed → Confirmed → <span class="current">Ready for Pickup</span></h5>').appendTo($status);
  }

  const $foods = $("<div>").addClass("col-sm-9 col-xs-12 admin-item-foods").appendTo($order);
  const $ul = $("<ul>").addClass("order-list").appendTo($foods);

  const counted = countItems(orderItems);

  for (let key in counted) {
    $("<li>").text(`${counted[key]} ${key}`).appendTo($ul);
  }

  const $confirm = $("<div>").addClass("col-sm-3 col-xs-12 admin-item-confirm").appendTo($order);
  const $form = $("<form>").addClass("admin").attr({ id: "confirm" }).appendTo($confirm);
  if (order.status === "Placed") {
    $("<p>").text("Preparation time:").appendTo($form);
    $("<input>").addClass("eta-time").attr({ id: order.id, type: "number", min: 0, max: 99, name: "eta" }).appendTo($form);
    $("<p>").text("Minutes").appendTo($form);
    $("<button>").addClass("btn btn-primary").attr({ value: "submit" }).text("Confirm Order").appendTo($form);
  } else if (order.status === "Confirmed") {
    $("<p>").text("SMS sent to customer!").appendTo($form);
    console.log(order.eta);
    $("<span>").addClass("eta-confirmed").text(order.eta).appendTo($form);
    $("<p>").text("Minutes").appendTo($form);
    $("<button>").addClass("btn btn-primary").attr({ value: "submit" }).text("Ready for pickup").appendTo($form);
  }
  return $order;
}


// Matches order items to their order #
function filterOrders(orderData) {
  const filtered = [];
  orderData.orders.forEach(order => {
    const orderItems = orderData.items.filter(function(item) {
      return order.id === item.id;
    });
    filtered.push(createOrder(order, orderItems));
  });
  return filtered;
}

// Appends each unique order to newly emptied container
function appendOrders(orderData) {
  $('#admin-list').empty();
  const filtered = filterOrders(orderData);
  filtered.forEach(order => {
    $('#admin-list').append(order);
  });
}

// Loads all the orders via an ajax request
function loadOrders() {
  $.ajax({
      method: "GET",
      url: "/api/admin"
    })
    .done(function(orderData) {
      appendOrders(orderData);
    });
}