﻿/*
    Features still needed:
    1. Save a players state - Local Storage (modernizer detection)
        a. Have totalCurrency and ClickPS saved, need to save the observable array.
    2. Add Firefox support for animations
    3. Increase price after purchase
    4. Add iPhone, iPad specific meta tags and Touch support
        Tried using fastclick, this works on the iPhone in a webView, but doesn't seem to on Safari or Chrome browsers on Mobile.
        https://github.com/ftlabs/fastclick
    5. Use SVG files, creative commons:
        http://thenounproject.com

    DONE:
    * DONE: Only accrue ClicksPS every second

*/


// Class representing Item Button
function ItemButton(name, price, cps, symbol, owned, basePrice) {
    var self = this;
    self.name = name;
    self.price = ko.observable(price);
    self.cps = cps;
    self.symbol = symbol;
    self.owned = ko.observable(owned);
    self.basePrice = ko.observable(basePrice);

    self.formattedPrice = ko.computed(function () {
        // Use accounting.js to format money
        return accounting.formatMoney(self.price(),"$",0);
    })

    // Buying an item increases the price as well
    // Using the compound interest formula
    self.buyItem = function (e) {
        if (totalCurrency >= self.price()) {
            totalCurrency -= self.price();
            CPS += self.cps;
            // Increase the players inventory
            self.owned(self.owned() + 1);
            // Increase the item price
            self.price( self.basePrice() + (self.basePrice() * (.05 * self.owned())) );
        }
    }

    // Selling an item comes with a cost
    // Only return 90% of the previous purchase price
    self.sellItem = function (e){
        if(self.owned() > 0){
            // Calculate the refund
            //alert(self.price());
            var refund = 0;
            if(self.owned() === 1){
                refund = (self.basePrice() + (self.basePrice() * (.05 * self.owned()))  *.9);
            }else{
                refund = (self.basePrice() + (self.basePrice() * (.05 * self.owned()) - 1)  *.9);
            }
            
            // Give the refund to the player
            totalCurrency += refund;
            // Take the item from the inventory
            self.owned(self.owned() - 1);
            // Set the lower price
            self.price( self.basePrice() + (self.basePrice() * (.05 * self.owned())) );
            // Reduce the CPS
            CPS -= self.cps;
        }
    }
}

function Player(name,score){
    this.name = name;
    this.score = ko.observable(score);
}

// Viewmodel for this screen
var koClickView =  {    
    buttons : ko.observableArray([]),
    playerCash : ko.observable(0)
}


//Game inventory data
var clickItems = [
        { name: "Mouse", price: 10, cps: .1, symbol:"img/mouse.png", fontSymbol: "🐁", owned: 0, basePrice:10 },
        { name: "Dog", price: 100, cps: 1, symbol:"img/dog.png", fontSymbol: "🐕", owned: 0, basePrice:100 },
        { name: "Chicken", price: 500, cps: 10, symbol:"img/chicken.png", fontSymbol: "🐔", owned: 0, basePrice:500 },
        { name: "Octopus", price: 3000, cps: 25, symbol:"img/octopus.png", fontSymbol: "🐙", owned: 0, basePrice:3000 }
    ];



function loadKoData(clickItems){
    for (var i = 0; i < clickItems.length; i++) {
        koClickView.buttons.push(new ItemButton(clickItems[i].name,
            clickItems[i].price,
            clickItems[i].cps,
            clickItems[i].symbol,
            clickItems[i].owned,
            clickItems[i].basePrice))
    }
}

loadKoData(clickItems);