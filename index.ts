import inquirer from "inquirer";

class Game {
    enemies = ['Skeleton', 'Zombie', 'Warrior', '   Assassin'];
    enemyMaxHealth = 100;
    enemyAttackDamage = 25;
    enemyHealth = this.randomNum(this.enemyMaxHealth);

    health = 100;
    attackDamage = 50;
    healthPotions = 3;
    healthPotionHealAmount = 30;
    healthPotionDropChance = 50; // Percentage
    running = true;

    async start() {
        console.log('Welcome to the Dungeon!');
        console.log('---------------------------------------------');
        await this.play();
    }

    randomNum(refNum: number) {
        return Math.floor(Math.random() * refNum);
    }

    async attack(enemy: string) {
        let damageGiven = this.randomNum(this.attackDamage);
        let damageTaken = this.randomNum(this.enemyAttackDamage);
        this.enemyHealth -= damageGiven;
        this.health -= damageTaken;
        if (this.enemyHealth < 1) {
            console.log(this.enemyHealth);

            console.log(`Congrats! You knocked out ${enemy}`);
            let randomNumberForHealthPotion = this.randomNum(100);
            let willGetHealthPotion = randomNumberForHealthPotion <= this.healthPotionDropChance;
            console.log('willGetHealthPotion', randomNumberForHealthPotion, willGetHealthPotion);

            if (willGetHealthPotion) {
                this.healthPotions += 1;
                console.log(`${enemy} dropped Health Potion. Your total health potions are ${this.healthPotions}`);
            };
            let nextStepRes = await inquirer.prompt([{
                type: "list",
                name: 'nextStep',
                choices: ['Do Another Fight', 'Exit Dungeon'],
                message: 'What would you like to do?'
            }]);
            if (nextStepRes.nextStep === 'Do Another Fight') {
                console.log('Do Another Fight');
                // this.health = 100;
                this.enemyHealth = this.randomNum(this.enemyMaxHealth);
                await this.start();
            } else {
                console.log(`#################################################
    # Thanks for Playing #
#################################################`);
                this.running = false;
            }
        } else {
            console.log(`You strike the ${enemy} for ${damageGiven} damage.`);
            console.log(`You receive ${damageTaken} in retaliation.`);
        }
    }

    async play() {
        let enemy = this.enemies[this.randomNum(this.enemies.length)];
        console.log(`${enemy} has been Appeared!`);
        while (this.health > 0 && this.running) {
            console.log(`Your HP: ${this.health}`);
            console.log(`Enemy's HP: ${this.enemyHealth}`);
            let actionRes = await inquirer.prompt([
                {
                    name: 'action',
                    type: 'list',
                    choices: ['Attack', 'Drink Health Potion', 'Run'],
                    message: 'What would you like to do?'
                }
            ]);
            switch (actionRes.action) {
                case "Attack":
                    await this.attack(enemy);
                    break;
                case "Drink Health Potion":
                    if (this.healthPotions === 0) {
                        console.log('No Health Potions Available.');
                    } else if (this.health === 100) {
                        console.log('Your health is full');
                    } else {
                        this.healthPotions -= 1;
                        this.health += this.healthPotionHealAmount;
                        if (this.health > 100) this.health = 100;
                        console.log(`You took one health Potion. Remaining Health Potions: ${this.healthPotions}`);
                    }
                    break;
                case "Run":
                    console.log(`You run away from ${enemy}`);
                    this.health = 100;
                    this.enemyHealth = this.randomNum(this.enemyMaxHealth);
                    await this.start();
                    break;
                default:
                    break;
            }

        }
        if (this.health < 1) {
            console.log(`You lost! Hp 0`);

            let nextStepRes = await inquirer.prompt([{
                type: "list",
                name: 'nextStep',
                choices: ['Play Again', 'Exit Dungeon'],
                message: "What would you like to do next?"
            }]);
            if (nextStepRes.nextStep === 'Play Again') {
                this.health = 100;
                this.enemyHealth = this.randomNum(this.enemyMaxHealth);
                await this.start();
            } else {
                console.log(`#################################################
    # Thanks for Playing #
#################################################`);
            }
        }
    }
}

let game = new Game();
game.start();