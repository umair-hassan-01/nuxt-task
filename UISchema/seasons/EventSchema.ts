const seasonEventFormSchema = 
{
    "type": "VerticalLayout",
    "elements": [
        {
            "type": "HorizontalLayout",

            "elements": [
                {
                    type: 'Control',
                    scope: '#/properties/eventType',
                },
                {
                    type: 'Control',
                    scope: '#/properties/title',
                }
            ]
        },
        {
            "type": "HorizontalLayout",
            "elements": [
                {
                    "type": "Control",
                    "scope": "#/properties/startTime",
                    "label": "Date with 12H Time no seconds",
                    "options": {
                        "ampm": true,
                        "dateTimeFormat": "MM/DD/YYYY hh:mm a"
                    }
                },
                {
                    "type": "Control",
                    "scope": "#/properties/endTime",
                    "label": "Date with 12H Time no seconds",
                    "options": {
                        "ampm": true,
                        "dateTimeFormat": "MM/DD/YYYY hh:mm a"
                    }
                }
            ]
        },
        {
            "type": "HorizontalLayout",
            "elements": [
                {
                    "type": "Control",
                    "scope": "#/properties/qualifierDuration"
                },
                {
                    "type": "Control",
                    "scope": "#/properties/tournamentDuration"
                }
            ]
        },
        {
            "type": "HorizontalLayout",
            "elements": [
                {
                    "type": "Control",
                    "scope": "#/properties/tickets"
                },
                {
                    "type": "Control",
                    "scope": "#/properties/prizePool"
                }
            ]
        }
    ]
};

export default seasonEventFormSchema;