function Gauge(placeholderName, configuration)
{
	this.placeholderName = placeholderName;
	
	var self = this; // for internal d3 functions
	
	this.configure = function(configuration)
	{
		this.config = configuration;
		
		this.config.size = this.config.size * 0.5;
		
		this.config.raduis = this.config.size * 0.97 / 2;
		this.config.cx = this.config.size ;
		this.config.cy = this.config.size ;
		
		this.config.min = undefined != configuration.min ? configuration.min : 0; 
		this.config.max = undefined != configuration.max ? configuration.max : 100; 
		this.config.range = this.config.max - this.config.min;
		this.config.ValueFontSize = configuration.ValueFontSize || 32;
		this.config.LabelFontSize = configuration.LabelFontSize || 32;
		this.config.MaxValueFontSize = configuration.MaxValueFontSize || 16;

		this.config.backColor 	= configuration.backColor || "#e6e6e6";
		this.config.curColor = configuration.curColor || "#5a9fd3";
		this.config.tarColor = configuration.tarColor || "#ec7e30";
		this.config.cur_val = configuration.cur_val || 75;
		this.config.target_val = configuration.target_val || 290;
		this.config.label = configuration.label || "Calls";
		this.config.prefix = configuration.prefix || "";
		this.config.postfix = configuration.postfix || "";
		
		this.config.transitionDuration = configuration.transitionDuration || 500;
	}

	this.render = function()
	{
		postfix = this.config.postfix;
		prefix = this.config.prefix;
		var chartId = "#" + this.placeholderName;
		$(chartId).html("");
		this.body = d3.select("#" + this.placeholderName)
							.append("svg:svg")
							.attr("class", "gauge")
							.attr("width", this.config.size*2)
							.attr("height", this.config.size*2);

		target_val = this.config.target_val;
		cur_val = this.config.cur_val;
		target_val = this.config.target_val;
		total_val = cur_val + target_val;
		curColor = this.config.curColor;
		tarColor = this.config.tarColor;
		backColor = this.config.backColor;

		this.drawBand(0, 100, backColor, 0.6, 0.9, 360, 0);
		var val_pos = 100/total_val*cur_val;
		this.drawBand(0, val_pos, curColor, 0.6, 0.9, 360, 0);
		this.drawBand(val_pos+0.5, 99.5, tarColor, 0.6, 0.9, 360, 0);
		

		fontSize = this.config.ValueFontSize;

		this.body.append("svg:text")
					.attr("x", this.config.cx)
					.attr("y", this.config.cy - fontSize/2)
					.attr("dy", fontSize / 2)
					.attr("text-anchor", "middle")
					.text(prefix+cur_val+postfix)
					.style("font-size", fontSize + "px");

		this.body.append("svg:text")
					.attr("x", this.config.cx)
					.attr("y", this.config.cy+fontSize/2)
					.attr("dy", fontSize / 4)
					.attr("text-anchor", "middle")
					.text("of "+target_val)
					.style("font-size", (fontSize/2) + "px");

		fontSize = this.config.MaxValueFontSize;

		// this.body.append("svg:text")
		// 			.attr("x", this.config.cx/2*3)
		// 			.attr("y", fontSize/3)
		// 			.attr("dy", fontSize / 2)
		// 			.attr("text-anchor", "middle")
		// 			.style("fill",backColor)
		// 			.text(prefix+min_val+postfix)
		// 			.style("font-size", fontSize + "px");
		// this.body.append("svg:text")
		// 			.attr("x", this.config.cx/2)
		// 			.attr("y", fontSize/3)
		// 			.attr("dy", fontSize / 2)
		// 			.attr("text-anchor", "middle")
		// 			.style("fill",backColor)
		// 			.text(prefix+max_val+postfix)
		// 			.style("font-size", fontSize + "px");

		fontSize = this.config.LabelFontSize;
		label = this.config.label;

		this.body.append("svg:text")
  					.attr("transform","translate("+fontSize+","+this.config.cy+") rotate(-90)")
					.attr("dy", fontSize / 2)
					.attr("text-anchor", "middle")
					.text(label)
					.style("font-size", fontSize + "px");
	}
	
	this.drawBand = function(start, end, color, inner_radius, outer_radius, value1, value2)
	{
		if (0 >= end - start) return;
		
		this.body.append("svg:path")
					.style("fill", color)
					.attr("d", d3.svg.arc()
						.startAngle(this.valueToRadians(start, value1, value2))
						.endAngle(this.valueToRadians(end, value1, value2))
						.innerRadius(inner_radius * this.config.raduis)
						.outerRadius(outer_radius * this.config.raduis))
					.attr("transform", function() { return "translate(" + self.config.cx + ", " + self.config.cy + ") rotate("+value1+")" });
	}
	
	this.valueToDegrees = function(value, value1, value2)
	{
		// thanks @closealert
		//return value / this.config.range * 270 - 45;
		return value / this.config.range * value1 - (this.config.min / this.config.range * value1 + value2);
	}
	
	this.valueToRadians = function(value, value1, value2)
	{
		return this.valueToDegrees(value, value1, value2) * Math.PI / 180;
	}
	// initialization
	this.configure(configuration);	
}