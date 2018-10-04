const w = 1600;
const h = 800;
const padding = 150;

xhr = new XMLHttpRequest();
xhr.open('GET', 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json');
xhr.send();
xhr.onload = function() {
	json = JSON.parse(xhr.responseText);
	let dataset = json.monthlyVariance;
	const baseTemp = json.baseTemperature;
	dataset.forEach((x) => {
		x.temperature = Math.round((baseTemp+ x.variance)*10)/10;
		x.month --;
	});
	const cellHeight = ((h - 2 * padding)/12) + 3;
	console.log(dataset)

	const xScale = d3.scaleTime()
		.domain([d3.min(dataset, (d) => new Date(d.year, 0, 1)), d3.max(dataset, (d) => new Date(d.year, 0, 1))])
		.range([padding, w - padding]);

	const yScale = d3.scaleTime()
		.domain([d3.min(dataset, (d) => new Date(0, d.month, 1)), d3.max(dataset, (d) => new Date(0, d.month, 1))])
		.range([padding, h - padding]);

		console.log(yScale.domain)
	 
	const svg = d3.select("body")
	 				.append("svg")
	 				.attr("width", w)
	 				.attr("height", h)

	 svg.selectAll("rect")
	 	.data(dataset)
	 	.enter()
	 	.append("rect")
	 	.attr("x", (d) => xScale(new Date(d.year, 0, 1)))
	 	.attr("y", (d) => yScale(new Date(0, d.month, 1)))
	 	.attr("width", (d) => (w - 2 * padding)/(dataset[dataset.length-1].year - dataset[0].year))
	 	.attr("height", (d) => cellHeight)
	 	.attr("fill", (d) => {
	 		const tempMin = d3.min(dataset, (d) => d.temperature);
	 		const tempMax = d3.max(dataset, (d) => d.temperature);
	 		const tempRange = tempMax - tempMin;
	 		const fraction = (d.temperature - tempMin) / tempRange;
	 		let blue = 255 - (fraction * 255);
	 		let red = 255 * fraction;
	 		return "rgb(" + red + ", 0, " + blue + ")";
	 	})
	 	.attr("class", "cell")
	 	.attr("data-month", (d) => d.month)
	 	.attr("data-year", (d) => d.year)
	 	.attr("data-temp", (d) => d.temperature)
	 	.on('mouseover', (d) => {
	 		const toolTip = document.getElementById("tooltip")
	 		toolTip.style.display = "inline-block";
	 		toolTip.style.left = event.pageX -25 + "px";
	 		toolTip.style.top = event.pageY -80 + "px";
	 		toolTip.setAttribute("data-year", d.year);
	 		document.getElementById("year").innerHTML = d.year;
	 		document.getElementById("temp").innerHTML = d.temperature + "&#8451";
	 		document.getElementById("variance").innerHTML = d.variance + "&#8451";
	 	})
	 	.on('mouseout', (d) => {
	 		document.getElementById("tooltip").style.display = "none";
	 	})

	const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%Y"));
	const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%B"));

	 svg.append("g")
		.attr("transform", "translate(0," + (h - padding + cellHeight) + ")")
		.attr("id", "x-axis")
		.call(xAxis);

	svg.append("g")
		.attr("transform", "translate(" + (padding) + "," + cellHeight/2 + ")")
		.attr("id", "y-axis")
		.call(yAxis);

	const legend = d3.select("#legend")
						.append("svg")
						.attr("width", 1600)
						.attr("height", 40);

	const legendData = [{"color": "rgb(0,0,255)", "temp": "-7ºC"},{"color": "rgb(85,0,170)", "temp": "0ºC"},{"color": "rgb(170,0,85)", "temp": "7ºC"},{"color": "rgb(255,0,0)", "temp": "14ºC"}]

	legend.selectAll("rect")
		.data(legendData)
		.enter()
		.append("rect")
	 	.attr("x", (d, i) => padding + 500 + i * 100)
	 	.attr("y", 7)
	 	.attr("width", 20)
	 	.attr("height", 20)
	 	.attr("fill", (d) => d.color)
	 	
	legend.selectAll("text")
		.data(legendData)
		.enter()
	 	.append("text")
	 	.text((d) => d.temp)
	 	.attr("x", (d, i) => padding + 500 + i * 100)
	 	.attr("y", 40)
	 	.attr("font-size", "10px")

}