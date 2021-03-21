import { AppLocalization } from 'src/app/common/LocaleRes';
export const SubSystem = {
  "SelectedOperation": {
    "Code": "Contains",
    "Name": AppLocalization.Contains
  },
  "_isCheck": false,
  "IsDefault": false,
  "IsNew": true,
  "Search": {
    "IsSearch": true
  },
  "Caption": AppLocalization.Subsystem,
  "IdCategory": 0,
  "Name": "SubSystem",
  "FilterType": "Array",
  "SupportedOperationTypes": [
    "Contains",
    "NotContains"
  ],
  "SelectedOperationType": "Contains",
  "Value": [
    {
      "Id": 1,
      "Name": AppLocalization.Monitoring
    },
    {
      "Id": 3,
      "Name": AppLocalization.Lighting
    },
    {
      "Id": 1,
      "Name": AppLocalization.Monitoring
    }
  ],
  "Lookup": {
    "DataSource": [
      {
        "Id": 1,
        "Name": AppLocalization.Monitoring
      },
      {
        "Id": 3,
        "Name": AppLocalization.Lighting
      },
      {
        "Id": 1,
        "Name": AppLocalization.Monitoring
      }
    ],
    "LookupField": {
      "DisplayField": "Name",
      "ValueField": "Id"
    }
  },
  "Data": [
    {
      "IsCheck": true,
      "Value": {
        "Id": 1,
        "Name": AppLocalization.Monitoring
      }
    },
    {
      "IsCheck": true,
      "Value": {
        "Id": 3,
        "Name": AppLocalization.Lighting
      }
    },
    {
      "IsCheck": true,
      "Value": {
        "Id": 1,
        "Name": AppLocalization.Monitoring
      }
    }
  ]
}

export const LogicDevice = {
  "SelectedOperation": {
    "Code": "Contains",
    "Name": AppLocalization.Contains
  },
  "_isCheck": false,
  "IsDefault": false,
  "IsNew": true,
  "Search": {
    "IsSearch": true
  },
  "Caption": AppLocalization.Label32,
  "IdCategory": 0,
  "Name": "LogicDevice",
  "FilterType": "Array",
  "SupportedOperationTypes": [
    "Contains",
    "NotContains"
  ],
  "SelectedOperationType": "Contains",
  "Value": [
    {
      "Id": 7816,
      "Name": AppLocalization.Room306
    },
    {
      "Id": 8817,
      "Name": AppLocalization.VRUSec4vv
    }
  ],
  "Lookup": {
    "DataSource": [
      {
        "Id": 7816,
        "Name": AppLocalization.Room306
      },
      {
        "Id": 8817,
        "Name": AppLocalization.VRUSec4vv
      }
    ],
    "LookupField": {
      "DisplayField": "Name",
      "ValueField": "Id"
    }
  },
  "Data": [
    {
      "IsCheck": true,
      "Value": {
        "Id": 7816,
        "Name": AppLocalization.Room306
      }
    },
    {
      "IsCheck": true,
      "Value": {
        "Id": 8817,
        "Name": AppLocalization.VRUSec4vv
      }
    }
  ]
}

export const Acknowledged = {
  "SelectedOperation": {
    "Code": "Equal",
    "Name": AppLocalization.Equals
  },
  "_isCheck": false,
  "IsDefault": false,
  "IsNew": true,
  "Search": {
    "IsSearch": false
  },
  "Caption": AppLocalization.Kvited,
  "IdCategory": 0,
  "Name": "Acknowledged",
  "FilterType": "Bool",
  "SupportedOperationTypes": [
    "Equal"
  ],
  "SelectedOperationType": "Equal",
  "Value": false,
  "EditorType": 5,
  "Data": {
    "IsCheck": false,
    "Value": false
  }
}