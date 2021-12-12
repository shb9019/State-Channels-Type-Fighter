const _ = require('lodash');
var express = require('express');
var router = express.Router();

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const matches =  [];

router.get('/:id', async (req, res) => {
  console.log('Matches:', matches);
  let availableMatchIndex = _.findIndex(matches, match => match.bob == null);

  if (availableMatchIndex === -1) {
    matches.push({
      alice: req.params.id,
      bob: null
    });
    availableMatchIndex = matches.length - 1;

    while(matches[availableMatchIndex].bob == null) {
      await sleep(500);
    }
  } else {
    matches[availableMatchIndex].bob = req.params.id;
  }

  return res.send(matches[availableMatchIndex]);
});

module.exports = router;
