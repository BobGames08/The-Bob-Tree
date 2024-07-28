addLayer("a", {
    name: "achievement",
    symbol: "A",
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},
    color: "#FFB200",
    resource: "Achievements",
    type: "none",
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
            done() { return hasUpgrade('r', 13)},
        },
        16: {
            name: "Inflation?",
            tooltip: "Reach 750 Prestige points",
            done() { return player.p.points.gte(750)}
        },
        21: {
            name: "Not Stonks",
            tooltip: "Buy Acutal Dilemma",
            done() {return hasUpgrade('p', 24)}
        },
        22: {
            name: "Prolouge",
            tooltip: "Complete Introduction",
            done() {return hasChallenge('c', 11)}
        },
        23: {
            name: "Programming",
            tooltip: "Complete Initialize",
            done() {return hasChallenge('c', 12)}
        },
        24: {
            name: "Problem?",
            tooltip: "Complete Interesting",
            done() {return hasChallenge('c', 13)}
        },
        25: {
            name: "A Reset In The Poetic Sense",
            tooltip: "Buy New Game+",
            done() {return hasUpgrade('r', 23)}
        },
        26: {
            name: "But Why?",
            tooltip: "Buy a Weak Booster. Reward: +1% Rebirth Points",
            done() {return hasUpgrade('p', 32)}
        },
        31: {
            name: "Decently Big Numbers",
            tooltip: "Reach 1e9 Points",
            done() {return player.points.gte(1e9)}
        },
        32: {
            name: "Going Down",
            tooltip: "Get Energy. Reward: +20% Prestige Points",
            done() {return player.e.points.gte(1)}
        },
        33: {
            name: "Making Progress",
            tooltip: "Get 3 Energy",
            done() {return player.e.points.gte(3)}
        },
        34: {
            name: "EUREKA!",
            tooltip: "Complete Idea. Reward: Unlock 3 More Energy Upgrades",
            done() {return hasChallenge('c', 21)}
        },
        35: {
            name: "At The Speed Of Light",
            tooltip: "Buy Coulomb. Reward: +5% Rebirth Points",
            done() {return hasUpgrade('e', 21)}
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
        if (hasUpgrade('p', 23)) mult = mult.times(upgradeEffect('p', 23))
        if (hasUpgrade('p', 24)) mult = mult.times(0.8)
        if (inChallenge('c', 13)) mult = mult.times(2)
        if (hasUpgrade('r', 23)) mult = mult.times(upgradeEffect('r', 23))
        if (hasUpgrade('p', 34)) mult = mult.times(upgradeEffect('p', 34))
        if (hasAchievement('a', 32)) mult = mult.times(1.2)
        if (hasUpgrade('e', 22)) mult = mult.times(upgradeEffect('e', 22))
        if (hasUpgrade('e', 12)) mult = mult.times(1.2)    
        if (inChallenge('c', 12)) mult = mult.pow(0.5)    
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
            description: "Double your point gain",
            cost: new Decimal(1),
        },
        12: {
            title: "The simplest booster!",
            description: "Boost point gain based on prestige points",
            cost: new Decimal(2),
            effect() {
                return player[this.layer].points.add(1).pow(0.5)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        13: {
            title: "Inverse Booster",
            description: "Boost prestige point gain based on points",
            cost: new Decimal(5),
            effect() {
                return player.points.add(1).pow(0.15)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        14: {
            title: "Recycling",
            description: "Double point gain again",
            cost: new Decimal(50),    
            unlocked() {
                return hasUpgrade('r', 21)
            }
        },
        21: {
            title: "Fractal Engine",
            description: "Boost point gain based on points",
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
        },
        23: {
            title: "Sierpiński triangle",
            description: "Prestige Points boost Prestige Point gain",
            cost: new Decimal(100),
            effect() {
                return player[this.layer].points.add(1).pow(0.01)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked() {
                return hasUpgrade('r', 21)
            }
        },
        24: {
            title: "Actual Dilemma",
            description: "20% more points but less prestige points",
            cost: new Decimal(1500),
            unlocked() {
                return hasUpgrade('r', 21)
            }
        },
        31: {
            title: "Upcycling",
            description: "2.5x more points",
            cost: new Decimal(100000),
            unlocked() {
                return hasChallenge('c', 11)
            }
        },
        32: {
            title: "Weak Booster",
            description: "Prestige points boost point gain again",
            cost: new Decimal(200000),
            effect() {
                return player[this.layer].points.add(1).pow(0.1)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked() {
                return hasChallenge('c', 11)
            }
        },
        33: {
            title: "Game Of Life",
            description: "Points boost point gain again",
            cost: new Decimal(350000),
            effect() {
                return player.points.add(1).pow(0.05)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked() {
                return hasChallenge('c', 13)
            }
        },
        34: {
            title: "Dynamo",
            description: "Points boost Prestige Point Gain again",
            cost: new Decimal(750000),
            effect() {
                return player.points.add(1).pow(0.03)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked() {
                return hasChallenge('c', 13)
            }
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
        let mult = new Decimal(1)
        if (hasAchievement('a', 26)) mult = mult.times(1.01)
        if (hasUpgrade('e', 13)) mult = mult.times(1.2)
        if (hasUpgrade('r', 32)) mult = mult.times(upgradeEffect('r', 32))
        if (hasChallenge('c', 21)) mult = mult.times(1.5)
        if (hasAchievement('a', 35)) mult = mult.times(1.05)
        return mult               // Factor in any bonuses multiplying gain here.
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
        },
        22: {
            title: "Sidegrade",
            description: "Challenge Points boost Point Gain",
            cost: new Decimal(35),
            effect() {
                return player.c.points.add(1).pow(0.5)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked() {
                return hasChallenge('c', 12)
            }
        },
        23: {
            title: "New Game+",
            description: "Challenge Points boost Prestige Point Gain",
            cost: new Decimal(75),
            effect() {
                return player.c.points.add(1).pow(0.3)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked() {
                return hasChallenge('c', 12)
            }
        },
        31: {
            title: "Taser",
            description: "Triple Point Gain",
            cost: new Decimal(100),
            unlocked() {
                return hasUpgrade('e', 11)
            }
        },
        32: {
            title: "The Booster we've all been waiting for",
            description: "Prestige Points boost Rebirth Point Gain",
            cost: new Decimal(225),
            effect() {
                return player[this.layer].points.add(1).pow(0.005)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked() {
                return hasUpgrade('e', 12)
            }
        },
        33: {
            title: "Intercom",
            description: "Unlock a New Challenge",
            cost: new Decimal(600),
            unlocked() {
                return hasUpgrade('e', 13)
            }
        }
    },
})

addLayer("c", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: true,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
    }},

    color: "#9B2321",                       // The color for this layer, which affects many elements.
    resource: "challenge point",            // The name of this layer's main prestige resource.
    row: 1,                                 // The row this layer is on (0 is the first row).

    baseResource: "points",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.points },  // A function to return the current amount of baseResource.

    requires: new Decimal(100000),              // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "static",                         // Determines the formula used for calculating prestige currency.
    exponent: 0.5,                          // "normal" prestige gain is (currency^exponent).

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        return new Decimal(1)               // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(1)
    },

    layerShown() { return hasAchievement('a', 21) },          // Returns a bool for if this layer's node should be visible in the tree.
    
    milestones: {
        0: {
            requirementDescription: "1 Challenge Point",
            effectDescription: "Unlock the first Challenge",
            done() { return player.c.points.gte(1) }
        },
        1: {
            requirementDescription: "3 Challenge Point",
            effectDescription: "Unlock the second Challenge",
            done() { return player.c.points.gte(3) }
        },
        2: {
            requirementDescription: "5 Challenge Point",
            effectDescription: "Unlock the third Challenge",
            done() { return player.c.points.gte(5) }
        }
    },

    challenges: {
        11: {
            name: "Introduction",
            challengeDescription: "Point gain is divided based on points",
            canComplete: function() {return player.points.gte(100)},
            unlocked() {
                return hasMilestone('c', 0)
            },
            rewardDescription: "Unlock 2 more Prestige Upgrades",
            goalDescription: "100 Points"
        },
        12: {
            name: "Initialize",
            challengeDescription: "Square root Point & Prestige Point Gain",
            canComplete: function() {return player.points.gte(100)},
            unlocked() {
                return hasMilestone('c', 1)
            },
            rewardDescription: "Unlock 2 more Rebirth Upgrades",
            goalDescription: "100 Points"
        },
        13: {
            name: "Interesting",
            challengeDescription: "Cube root Point Gain, but Double Prestige Point Gain",
            canComplete: function() {return player.points.gte(100)},
            unlocked() {
                return hasMilestone('c', 2)
            },
            rewardDescription: "Unlock 2 more Prestige Upgrades",
            goalDescription: "100 Points"
        },
        21: {
            name: "Idea",
            challengeDescription: "Introduction and Initialize simultaneously",
            countsAs: [11, 12],
            canComplete: function() {return player.points.gte(100)},
            unlocked() {
                return hasUpgrade('r', 33)
            },
            rewardDescription: "50% More Rebirth Points"
        }
    }
})

addLayer("e", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: true,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0),            // "points" is the internal name for the main resource of the layer.
    }},

    color: "#FFD700",                       // The color for this layer, which affects many elements.
    resource: "energy",            // The name of this layer's main prestige resource.
    row: 3,                                 // The row this layer is on (0 is the first row).

    baseResource: "prestige points",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.p.points },  // A function to return the current amount of baseResource.

    requires: new Decimal(1e8),              // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "static",                         // Determines the formula used for calculating prestige currency.
    exponent: 0.5,                          // "normal" prestige gain is (currency^exponent).

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        return new Decimal(1)               // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(1)
    },

    layerShown() { return hasAchievement('a', 31) },          // Returns a bool for if this layer's node should be visible in the tree.

        upgrades: {
            11: {
                title: "Volt",
                description: "Double Point Gain and Unlock a Rebirth Upgrade",
                cost: new Decimal(1),
            },
            12: {
                title: "Ampere",
                description: "+50% Prestige Points and Unlock a Rebirth Upgrade",
                cost: new Decimal(2),
            },
            13: {
                title: "Watt",
                description: "+20% Rebirth Points and Unlock a Rebirth Upgrade",
                cost: new Decimal(3),
            },
            21: {
                title: "Coulomb",
                description: "Boost Point Gain based on Total Energy and Unlock a Challenge Upgrade",
                cost: new Decimal(4),
                unlocked() {
                    return hasAchievement('a', 34)
                },
                effect() {
                    return player[this.layer].total.add(1).pow(0.5)
                },
                effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            },
            22: {
                title: "Franklin",
                description: "Boost Prestige Point Gain based on Best Energy and Unlock a Challenge Upgrade",
                cost: new Decimal(5),
                unlocked() {
                    return hasAchievement('a', 34)
                },
                effect() {
                    return player[this.layer].best.add(1).pow(1/3)
                },
                effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            },
            23: {
                title: "Biot",
                description: "... and Unlock a Challenge Upgrade",
                cost: new Decimal(6),
                unlocked() {
                    return hasAchievement('a', 34)
                },
            },
            
    },
})