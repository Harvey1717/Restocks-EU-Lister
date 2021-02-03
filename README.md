# RESTOCKS.NET AUTO LISTER & SCANNER

A program to automatically list items on [Restocks](https://restocks.net/) and scan existing listings to adjust the price.
# Table of Contents

- [Installation](#installation)
- [Setup](#setup)
  - [Settings:](#settings)
    - [Config](#config)
- [Running The Program](#running-the-program)
- [License](#license)

## Installation

**Install Required Packages Using NPM**

1. CD to directory of program
2. Run `npm i`

## Setup

### Settings

> The following settings are located in the /config folder

> Variables that have an asterix (*) at the start are optional (`*variable`)

#### Config

The JSON tasks file for this site has the following variables:

- `email` - Your Restocks account email 
- `password` - Your Restocks account password
- `delay` - Delay in ms, used in between listing products
- `lowestAskDifference` - ?
- `whitelistedProducts` - An array of products to ignore during scanning, the array items can be a product name string or a dictionary containing the `name` and `sizeIDs` values (see example below) 
- `specificConfig` - ?


Example config:

```json
{
  "email": "email@email.com",
  "password": "Password123",
  "delay": 10,
  "lowestAskDifference": 0,
  "whitelistedProducts": [{ "name": "Jordan 1 Retro High Black", "sizeIDs": ["5", "22"] }],
  "specificConfig": [
    {
      "listingId": "105838",
      "lowestAskDifference": 0,
      "lowestAskLimit": 142
    }
  ]
}
```
## Running The Bot

Start the program `node .`

---

Made with ❤  by [@dmc8787](https://twitter.com/dmc8787) & [@paymentdeclined](https://twitter.com/paymentdecIined)