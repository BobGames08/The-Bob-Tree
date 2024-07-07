addLayer("a", {
    name: "achievement",
    symbol: "A",
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},
    color: "#FFB200",
    resource: "Achievements",
    row: "side",

    achievements: {
        11: {
            name: "Starting",
            tooltip: "Get 1 Prestige Point",
            done() { return player.p.points.gte(1) },
        },
        12: {
            name: "Big Jump",
            tooltip: "Buy Inverse Booster",
            done() { return hasUpgrade('p', 13)},
        },
        13: {
            name: "Handful",
            tooltip: "Buy AAA Batteries",
            done() { return hasUpgrade('p', 22)}, 
        },
        14: {
            name: "Layer #2",
            tooltip: "Get 1 Rebirth Point. Reward: Double Point Gain",
            done() { return player.r.points.gte(1) },
        },
        15: {
            name: "Dilemma?",
            tooltip: "Buy the Direct Hit. Reward: 10% more Prestige Points",
            done() { return hasUpgrade('r',13)},
        }
    }
})

addLayer("p", {
    name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#4BDC13",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "prestige points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = new Decimal(1)
        if (hasUpgrade('p', 13)) mult = mult.times(upgradeEffect('p', 13))
        if (hasUpgrade('p', 22)) mult = mult.times(1.5)
        if (hasUpgrade('r', 11)) mult = mult.times(upgradeEffect('r', 11))   
        if (hasUpgrade('r', 12)) mult = mult.times(1.25)     
        if (hasAchievement('a', 15)) mult = mult.times(1.1)    
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    upgrades: {
        11: {
            title: "Make this whatever you want!",
            description: "Double your point gain.",
            cost: new Decimal(1),
        },
        12: {
            title: "The simplest booster!",
            description: "Boost point gain based on prestige points.",
            cost: new Decimal(2),
            effect() {
                return player[this.layer].points.add(1).pow(0.5)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        13: {
            title: "Inverse Booster",
            description: "Boost prestige point gain based on points.",
            cost: new Decimal(5),
            effect() {
                return player.points.add(1).pow(0.15)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        14: {
            title: "Anything?",
            description: "Double point gain again",
            cost: new Decimal(50),
            
            },    
        },
        21: {
            title: "Fractal Engine",
            description: "Boost point gain based on points.",
            cost: new Decimal(10),
            effect() {
                return player.points.add(1).pow(0.2)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        22: {
            title: "AAA Batteries",
            description: "Gain 1.5 times as many prestige points",
            cost: new Decimal(25)
        }
    },
})

addLayer("r", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: false,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
    }},

    color: "#007cb0",                       // The color for this layer, which affects many elements.
    resource: "rebirth points",            // The name of this layer's main prestige resource.
    row: 1,                                 // The row this layer is on (0 is the first row).
    hotkeys: [
        {key: "r", description: "R: Reset for rebirth points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],

    baseResource: "prestige points",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.p.points },  // A function to return the current amount of baseResource.

    requires: new Decimal(40),              // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "normal",                         // Determines the formula used for calculating prestige currency.
    exponent: 0.5,                          // "normal" prestige gain is (currency^exponent).

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        return new Decimal(1)               // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(1)
    },

    layerShown() { return hasAchievement('a', 13) },          // Returns a bool for if this layer's node should be visible in the tree.

    upgrades: {
        11: {
            title: "Gotta make this work somehow",
            description: "Rebirth points boost prestige points",
            cost: new Decimal(1),
            effect() {
                return player[this.layer].points.add(1).pow(0.25)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        12: {
            title: "Twin Booster",
            description: "Multiply point and prestige point gain by 1.25",
            cost: new Decimal(2),
        },
        13: {
            title: "Direct Hit",
            description: "Rebirth points boosts point gain",
            cost: new Decimal(3),
            effect() {
                return player[this.layer].points.add(1).pow(0.6)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        21: {
            title: "Opening",
            description: "Unlock 3 More Prestige Upgrades",
            cost: new Decimal(5),
        }
    },
})