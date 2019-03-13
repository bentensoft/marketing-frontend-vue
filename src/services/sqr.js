import axios from 'axios'

export const sqrService = {
  api: '',
  getCampaigns: async function (customerId) {
    return await axios.get(this.api + '/api/clients/' + customerId + '/campaigns')
  },
  getAdGroupsById: async function (clientId, campaignId) {
    return await axios.get(this.api + '/api/clients/' + clientId + '/campaigns/' + campaignId + '/ad_groups')
  },
  updateList: function (clientId, campaignId, adwordsId, keywords) {
    return axios.put(this.api + '/api/clients/' + clientId + '/campaigns/' + campaignId + '/ad_groups/' + adwordsId, {
      data: {
        'keywords': keywords
      }
    })
  },
  getAdGroup: function (customerId, campaignId) {
    axios.get(this.api + '/api/adgroups', {
      params: {
        'customer_id': customerId,
        'campaign_id': campaignId
      }
    })
      .then((resp) => {
        console.log(resp)
      }).catch((error) => {
        console.log(error.response.data.google_spreadsheet)
      })
  },
  sendKeywords: function (customerId, adgroupId, keywords) {
    axios.post(this.api + '/api/keywords', {
      customer_id: customerId,
      adgroup_id: adgroupId,
      keywords: keywords
    })
      .then((resp) => {
        console.log(resp)
      }).catch((error) => {
        console.log(error.response.data.google_spreadsheet)
      })
  }
}
