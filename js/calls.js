// Setting up global variables

// German localization
var localeDeDE = d3.locale({
    "decimal": ".",
    "thousands": ",",
    "grouping": [3],
    "currency": ["�", ""],
    "dateTime": "%A, der %e. %B %Y, %X",
    "date": "%d.%m.%Y",
    "time": "%H:%M:%S",
    "periods": ["AM", "PM"], // unused
    "days": ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
    "shortDays": ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
    "months": ["Januar", "Februar", "M�rz", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
    "shortMonths": ["Jan", "Feb", "Mrz", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"]
});
d3.time.format = localeDeDE.timeFormat;

// dimensions of the visualization
var width = 850,
    height = 200;

// padding space between section content and visualization
var padding = 50;

// setting up container for the visualization
var container = d3.select('#calls')
    .append('svg')
    .attr('id', 'container')
    .attr('width', width + padding * 2)
    .attr('height', height + padding * 2);

// setting up legend for the visualization
var info = d3.select('#calls')
    .select('#calls-info')
    .style('width', width + padding * 2)

// setting up visualization
var viz = container.append('g')
    .attr('id', 'viz')
    .attr('transform',
        'translate(' + padding + ','
        + padding + ')');

// setting up callScale (= y-scale)
var callScale = d3.scale.linear()
    .range([height, 0]);

// setting up durationScale (= y-scale)
var durationScale = d3.scale.linear()
    .range([height, 0]);

// setting up dateScale (= x-scale)
var dateScale = d3.time.scale()
    .range([0, width]);

// setting up callAxis
var callAxis = d3.svg.axis()
    .scale(callScale)
    .orient("left");

// setting up callAxis
var durationAxis = d3.svg.axis()
    .scale(durationScale)
    .orient("right");

var dateAxis = d3.svg.axis()
    .scale(dateScale)
    .orient("bottom")
    .tickFormat(d3.time.format("%b %y"));

// setting up lineGenerator for call stats
var LineGenerator = d3.svg.line()
    .x(function(d) { return dateScale(createDate(d.Date));})
    .y(function(d) { return callScale(d.Duration);})
    .interpolate("linear");

// setting up bisectDate
var bisectDate = d3.bisector(function(d) { return d.Date; }).left;

// create the legend
d3.select("#call-key")
    .style('background', '#d0624e');

d3.select("#duration-key")
    .style('background', '#17394d');

// importing JSON data
d3.json("data.json", function(data) {
    // find min and max of data set
    callScaleExtent = d3.extent(data, function(d) {
        return parseInt(d.Calls)
    });

    // setting up dateScale, which is an extension of the linear scale, but for time
    durationScaleExtent = d3.extent(data, function(d) {
        return parseInt(d.Duration)
    });

    // setting up dateScale, which is an extension of the linear scale, but for time
    dateScaleExtent = d3.extent(data, function(d) {
        return createDate(d.Date)
    });

    // format the scales, making them reach a bit wider
    // and giving them more room by multiplying the highest and lowest values
    callScale.domain([0, parseInt(callScaleExtent[1]) * 1.5]);

    // and giving them more room by multiplying the highest and lowest values
    durationScale.domain([0, parseInt(durationScaleExtent[1])]);

    oneDayEarlier = function(date) { return date.setDate(date.getDate() - 1)};
    oneDayLater = function(date) { return date.setDate(date.getDate() + 1)};
    dateScale.domain([oneDayEarlier(dateScaleExtent[0]), oneDayLater(dateScaleExtent[1])]);

    // create date axis based on time
    viz.append('g')
        .attr('class', 'date axis')
        .attr('transform', 'translate(0, ' + height + ')')
        .call(dateAxis)
        .selectAll('text')
        .attr('y', 6) // move the text down 6px
        .attr('x', 6) // move the text to the right 6px
        .attr('transform', 'rotate(45)')
        .style('text-anchor', 'start');

    // create call axis
    viz.append('g')
        .attr('class', 'call axis')
        .call(callAxis);

    // create duration axis
    viz.append('g')
        .attr('class', 'duration axis')
        .attr('transform', 'translate(' + width + ', 0)')
        .call(durationAxis);

    // create bars representing the total calls for each day
    callLine = viz.selectAll('g.bars')
                        .data(data)
                        .enter().append('g')
                        .attr('class', 'bars')
                        .attr('transform', function(d) {
                            return 'translate(' + dateScale(createDate(d.Date)) + ','
                                + callScale(0) + ')' });

    callLine.append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', 0)
        .attr('y2', function(d) {
            return callScale(d.Calls) - callScale(0)
        });

    // create bars representing the total duration for each day
    durationLine = viz.append("path")
                        .datum(data)
                        .attr("id", "duration-line")
                        .attr("d", LineGenerator(data))

    // create axis labels
    viz.append('text')
        .attr('transform', 'translate(' + -50 + ',' +
        -10 + ')' +
        'rotate(0)')
        .text('Calls')
        .attr('class', 'label')

    viz.append('text')
        .attr('transform', 'translate(' + 820 + ',' +
            -5 + ')' +
            'rotate(0)')
        .text('Duration (Minutes)')
        .attr('class', 'label')

    viz.on("mousemove", vizMouseMove);

    function vizMouseMove() {
        x = d3.mouse(this)[0],
            date = dateScale.invert(x),
            dateString = createString(date),
            i = bisectDate(data, dateString, 1),
            d = data[i];

        cursor = viz.select('#cursor');
        currentData = d3.select('#current-data')
            .select('h2');

        if (cursor.empty()) {
            cursor = viz.append('line')
                .attr('id', 'cursor')
                .attr('y1', 0)
                .attr('y2', height);
        };

        cursor.attr('x1', x)
            .attr('x2', x);
        // console.log(d)
        calls = d.Calls;
        duration = d.Duration;
        displayDay = d3.time.format("%A, %e. %B %Y");
        currentData.html("Am <b>" + displayDay(date) + "</b> hatten wir <b>" + calls + "</b> Anrufe und <b>" + duration + "</b> Minuten Gesprächszeit") ;
    }
});

function createDate(dateString) {
    // create a formatter based on how we expect data is expected
    var format = d3.time.format("%Y-%m-%d");
    // create a JavaScript data object based on the string
    return format.parse(dateString);
};

function createString(date) {
    // return a string from a date object
    var format = d3.time.format("%Y-%m-%d");
    return format(date)
};














