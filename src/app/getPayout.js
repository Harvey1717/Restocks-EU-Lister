const sellerfee = {
  consignment: 0.95,
  resale: 0.9,
};

module.exports = (listingPrice, sellMethod) => {
  const payout = parseInt(listingPrice) * sellerfee[sellMethod] - 10;
  if (payout < 0) {
    payout = 0;
  }
  return payout.toFixed(2);
};
