const data = {
  polygons_json: `
{
  "polygons": [
    {
      "name": "Shape2",
      "points": [
        {
          "x": -60,
          "y": -20
        },
        {
          "x": -170,
          "y": -140
        },
        {
          "x": -40,
          "y": -70
        },
        {
          "x": -20,
          "y": -180
        },
        {
          "x": 20,
          "y": -80
        },
        {
          "x": 160,
          "y": -170
        },
        {
          "x": 80,
          "y": -50
        },
        {
          "x": 190,
          "y": -10
        },
        {
          "x": 200,
          "y": 0
        },
        {
          "x": 200,
          "y": 0
        },
        {
          "x": 190,
          "y": 10
        },
        {
          "x": 80,
          "y": 50
        },
        {
          "x": 160,
          "y": 170
        },
        {
          "x": 20,
          "y": 80
        },
        {
          "x": -20,
          "y": 180
        },
        {
          "x": -40,
          "y": 70
        },
        {
          "x": -170,
          "y": 140
        },
        {
          "x": -60,
          "y": 20
        }
      ],
      "saved": true
    },
    {
      "name": "Shape3",
      "points": [
        {
          "x": -100,
          "y": -10
        },
        {
          "x": -70,
          "y": -110
        },
        {
          "x": 60,
          "y": -120
        },
        {
          "x": 20,
          "y": -20
        },
        {
          "x": 90,
          "y": 40
        },
        {
          "x": 60,
          "y": 120
        },
        {
          "x": -100,
          "y": 140
        }
      ],
      "saved": true
    },
    {
      "name": "Shape1",
      "points": [
        {
          "x": -120,
          "y": -80
        },
        {
          "x": -60,
          "y": -160
        },
        {
          "x": 50,
          "y": -180
        },
        {
          "x": 130,
          "y": -130
        },
        {
          "x": 180,
          "y": -50
        },
        {
          "x": 150,
          "y": 80
        },
        {
          "x": 90,
          "y": 130
        },
        {
          "x": -20,
          "y": 130
        },
        {
          "x": 50,
          "y": -20
        }
      ],
      "saved": true
    },
    {
      "name": "Shape4",
      "points": [
        {
          "x": -20,
          "y": -20
        },
        {
          "x": -20,
          "y": -50
        },
        {
          "x": 10,
          "y": -30
        },
        {
          "x": 50,
          "y": -60
        },
        {
          "x": 50,
          "y": 10
        },
        {
          "x": -10,
          "y": 30
        },
        {
          "x": -50,
          "y": 0
        }
      ],
      "saved": true
    },
    {
      "name": "Triangle",
      "points": [
        {
          "x": 160,
          "y": 0
        },
        {
          "x": -100,
          "y": -120
        },
        {
          "x": -100,
          "y": 120
        },
        {
          "x": 160,
          "y": 0
        }
      ],
      "saved": true
    },
    {
      "name": "BigC",
      "points": [
        {
          "x": 130,
          "y": 130
        },
        {
          "x": 130,
          "y": 60
        },
        {
          "x": 50,
          "y": 50
        },
        {
          "x": 30,
          "y": 100
        },
        {
          "x": -10,
          "y": 100
        },
        {
          "x": -40,
          "y": 50
        },
        {
          "x": -40,
          "y": 20
        },
        {
          "x": -20,
          "y": 0
        },
        {
          "x": 10,
          "y": -10
        },
        {
          "x": 60,
          "y": 10
        },
        {
          "x": 100,
          "y": 10
        },
        {
          "x": 140,
          "y": -30
        },
        {
          "x": 110,
          "y": -70
        },
        {
          "x": -40,
          "y": -90
        },
        {
          "x": -110,
          "y": -40
        },
        {
          "x": -90,
          "y": 50
        },
        {
          "x": -110,
          "y": 130
        },
        {
          "x": -30,
          "y": 180
        },
        {
          "x": 50,
          "y": 190
        }
      ],
      "saved": true
    }
  ]
}
`, appearances_json: `
{
  "appearances": [
    {
      "name": "Red",
      "fill": "#a30101",
      "stroke": "#ff0000",
      "text": "#9a9996",
      "width": "2",
      "saved": true
    },
    {
      "name": "Green",
      "fill": "#055f03",
      "stroke": "#2aff00",
      "text": "#c0bfbc",
      "width": "2",
      "saved": true
    },
    {
      "name": "Blue",
      "fill": "#0d00a3",
      "stroke": "#0049ff",
      "text": "#9a9996",
      "width": "2",
      "saved": true
    },
    {
      "name": "GrayWithYellow",
      "fill": "#3d3846",
      "stroke": "#f6d32d",
      "text": "#f9f06b",
      "width": "1",
      "saved": true
    },
    {
      "name": "GrayWithOrange",
      "fill": "#5e5c64",
      "stroke": "#ff7800",
      "text": "#ffbe6f",
      "width": "1",
      "saved": true
    },
    {
      "name": "GrayWithCyan",
      "fill": "#5e5c64",
      "stroke": "#00a3ff",
      "text": "#99c1f1",
      "width": "1",
      "saved": true
    }
  ]
}
`,
  partTypes_json:
    `
{
  "partTypes": [
    {
      "name": "PartType1",
      "polygon": "Shape4",
      "points": [],
      "saved": true
    },
    {
      "name": "PartType2",
      "polygon": "Shape3",
      "points": [],
      "saved": true
    }
  ]
}
`, actorTypes_json: `
{
  "actorTypes": [
    {
      "name": "ActorType1",
      "polygon": "Shape3",
      "mass": "1",
      "moves": "true",
      "collides": "true",
      "bouncecoefficient": "0.5",
      "parts": [],
      "saved": true
    },
    {
      "name": "ActorType2",
      "polygon": "BigC",
      "mass": "2",
      "moves": "",
      "collides": "",
      "bouncecoefficient": "0.9",
      "parts": [],
      "saved": true
    }
  ]
}
`, actors_json: `
{
  "actors": [
    {
      "name": "Actor1",
      "actorTypes": "ActorType2",
      "appearances": "Green",
      "positionX": "300",
      "positionY": "300",
      "velocityX": "0",
      "velocityY": "0",
      "facing": "0",
      "spin": "5",
      "undefined": [],
      "saved": true
    },
    {
      "name": "Actor2",
      "actorTypes": "ActorType1",
      "appearances": "Blue",
      "positionX": "-300",
      "positionY": "-300",
      "velocityX": "0",
      "velocityY": "0",
      "facing": "0",
      "spin": "-10",
      "undefined": [],
      "saved": true
    },
    {
      "name": "Actor3",
      "actorTypes": "ActorType2",
      "appearances": "Red",
      "positionX": "300",
      "positionY": "-300",
      "velocityX": "0",
      "velocityY": "0",
      "facing": "0",
      "spin": "0",
      "undefined": [],
      "saved": true
    },
    {
      "name": "Actor4",
      "actorTypes": "ActorType2",
      "appearances": "GrayWithOrange",
      "positionX": "-300",
      "positionY": "300",
      "velocityX": "0",
      "velocityY": "0",
      "facing": "0",
      "spin": "25",
      "undefined": [],
      "saved": true
    }
  ]
}`};
export default data;