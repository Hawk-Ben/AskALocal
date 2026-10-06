// fake events until the real event backend is done
// coordinates are [lng, lat] like mongo wants

const fakeEvents = [
    {
        _id: '1',
        title: 'Pickup Soccer',
        owner: { _id: 'u1', uname: 'Caleb' },
        description: 'input description',
        time: '2026-10-05T15:00',
        place: 'Sports and Recreation Center',
        location: { type: 'Point', coordinates: [-71.8106, 42.2741] },
    },
    {
        _id: '2',
        title: 'Study Group',
        owner: { _id: 'u2', uname: 'Griffin' },
        description: 'input description',
        time: '2026-10-06T18:30',
        place: 'Gordon Library',
        location: { type: 'Point', coordinates: [-71.8064, 42.2742] },
    },
    {
        _id: '3',
        title: 'Farmers Market',
        owner: { _id: 'u3', uname: 'Ben' },
        description: 'input description',
        time: '2026-10-07T10:00',
        place: 'Rubin Campus Center',
        location: { type: 'Point', coordinates: [-71.8084, 42.2749] },
    },
    {
        _id: '4',
        title: 'Board Game Night',
        owner: { _id: 'u4', uname: 'Lex' },
        description: 'input description',
        time: '2026-10-08T19:00',
        place: 'Fuller Labs',
        location: { type: 'Point', coordinates: [-71.8064, 42.2751] },
    },
]

export default fakeEvents
