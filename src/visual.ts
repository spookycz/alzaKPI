/*
 *  Power BI Visual CLI
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

module powerbi.extensibility.visual {
    "use strict";

    interface DataPoint {
        category: string;
        actualValue: number;
        previousValue: number;
        textInfo: string;
        crisisInfo: string;
    }
    interface ViewModel {
        dataPoints: DataPoint[];
        maxValue: number;
    }

    import ISelectionID = powerbi.visuals.ISelectionId;
    import ValueFormatter = powerbi.extensibility.utils.formatting.valueFormatter;
    import IValueFormatter = powerbi.extensibility.utils.formatting.IValueFormatter;

    export class Visual implements IVisual {
        private host: IVisualHost;
        private svg: d3.Selection<SVGElement>;
        private container: d3.Selection<SVGElement>;
        private category: d3.Selection<SVGElement>;
        private actualValueText: d3.Selection<SVGElement>;
        private previousValueText: d3.Selection<SVGElement>;
        private kpiLabel: d3.Selection<SVGElement>;
        private infoTextText: d3.Selection<SVGElement>;
        private crisisTextText: d3.Selection<SVGElement>;
        private visualSettings: VisualSettings;


        constructor(options: VisualConstructorOptions) {
            this.host = options.host;
            this.svg = d3.select(options.element)
                .append('svg')
                .classed('circleCard', true);
            this.container = this.svg.append("g")
                .classed('container', true);
            this.category = this.svg.append("g")
                .classed('category', true);
            this.actualValueText = this.container.append("text")
                .classed("actualValueText", true);
            this.previousValueText = this.container.append("text")
                .classed("previousValueText", true);
            this.kpiLabel = this.container.append("text")
                .classed("kbiLabel", true);
            this.infoTextText = this.container.append("text")
                .classed("infoTextText", true);
            this.crisisTextText = this.container.append("text")
                .classed("crisisTextText", true);
        }
        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration {
            const settings: VisualSettings = this.visualSettings ||
                VisualSettings.getDefault() as VisualSettings;
            return VisualSettings.enumerateObjectInstances(settings, options);
        }

        public update(options: VisualUpdateOptions) {
            let dataView: DataView = options.dataViews[0];
            let width: number = options.viewport.width;
            let height: number = options.viewport.height;
            this.visualSettings = VisualSettings.parse<VisualSettings>(dataView);
            let viewModel = this.getViewModel(options);
            this.visualSettings.dataLabel.precision = Math.min(8, this.visualSettings.dataLabel.precision);

            this.svg.attr({
                width: width,
                height: height
            });
            let suffix: string = this.visualSettings.dataLabel.suffixValue;
            if (!suffix || !(suffix == "")) {
                suffix = " " + suffix
            }
            //let textValue: string = valueFormatter.format(viewModel.dataPoints[0].actualValue);
            //let textValue: string = viewModel.dataPoints[0].actualValue.toString();
            let textValue: string = this.getFormatting(viewModel.dataPoints[0].actualValue, this.visualSettings.dataLabel.dataType, this.visualSettings.dataLabel.precision) + suffix;
            //console.log(textValue);
            this.actualValueText
                .text(textValue)
                .attr({
                    x: "50%",
                    y: "35%",
                    dy: "0.35em",
                    "text-anchor": "middle"
                }).style("font-size", this.visualSettings.dataLabel.actualValueFontSize + "px").style("font-weight", "bold").style("fill", this.visualSettings.dataLabel.defaultColor);




            this.previousValueText
                .text(this.visualSettings.previousValues.prefixType + " " + this.getFormatting(viewModel.dataPoints[0].previousValue, this.visualSettings.dataLabel.dataType, this.visualSettings.dataLabel.precision) + suffix)
                .attr({
                    x: "50%",
                    y: "90%",
                    dy: "0.35em",
                    "text-anchor": "middle"
                }).style("font-size", this.visualSettings.previousValues.previousValueFontSize + "px").style("fill", this.visualSettings.previousValues.previousValueColor);
            this.infoTextText
                .text(viewModel.dataPoints[0].textInfo)
                .attr({
                    x: "50%",
                    y: "76%",
                    dy: "0.35em",
                    "text-anchor": "middle",
                    color: "FF0000"
                }).style("font-size", this.visualSettings.textValues.infoTextFontSize + "px").style("fill", this.visualSettings.textValues.infoTextColor);
            this.crisisTextText
                .text(viewModel.dataPoints[0].crisisInfo)
                .attr({
                    x: "50%",
                    y: "60%",
                    dy: "0.35em",
                    "text-anchor": "middle"
                }).style("font-size", this.visualSettings.textValues.crisisTextFontSize + "px").style("fill", this.visualSettings.textValues.crisisTextColor).style("font-weight", "bold");
            //let fontSizeLabel: number = fontSizeValue / 4;
            this.kpiLabel
                .text(viewModel.dataPoints[0].category)
                .attr({
                    x: "50%",
                    y: "8%",
                    dy: "0.35em",
                    "text-anchor": "middle"
                })
                .style("font-size", this.visualSettings.kpiTitle.kpiLabelFontSize + "px").style("font-weight", "bold").style("fill", this.visualSettings.kpiTitle.kpiDefaultColor);
        }
        private getViewModel(options: VisualUpdateOptions): ViewModel {
            let dv = options.dataViews;

            let viewModel: ViewModel = {
                dataPoints: [],
                maxValue: 0
            }

            if (!dv
                || !dv[0]
                || !dv[0].categorical
                || !dv[0].categorical.categories
                || !dv[0].categorical.values)
                return viewModel;

            let view = dv[0].categorical;
            let categories = view.categories[0];
            let actualvalues = view.values[0];
            let previousvalues = view.values[1];
            let infoTexts = view.values[2];
            let crisisTexts = view.values[3];
            for (let i = 0, len = Math.max(categories.values.length, actualvalues.values.length, previousvalues.values.length, infoTexts.values.length, crisisTexts.values.length); i < len; i++) {
                viewModel.dataPoints.push(
                    {
                        category: <string>categories.values[i],
                        actualValue: <number>actualvalues.values[i],
                        previousValue: <number>previousvalues.values[i],
                        textInfo: <string>infoTexts.values[i],
                        crisisInfo: <string>crisisTexts.values[i]

                    }
                );
            }
            viewModel.maxValue = 0
            return viewModel;
        };
        private getFormatting(a: number, type: string, prec?: number): string {
            let ret: string;



            //let iValueFormatterCZ = valueFormatter.create({ format: ""});
            //console.log(iValueFormatterCZ.format(0.42));
            //console.log(viewModel);
            switch (type) {
                case 'percent':
                    if (!prec) {
                        prec = String(a).replace('.', '').length - a.toFixed().length - 2;
                    }
                    let valueFormatterPerc: IValueFormatter = ValueFormatter.create({ value: 0, format: "#,0 %", cultureSelector: "cs-CZ", precision: prec });
                    ret = valueFormatterPerc.format(a);
                    break;
                case 'whole':
                    let valueFormatterWhole: IValueFormatter = ValueFormatter.create({ format: "### ##0", cultureSelector: "cs-CZ" });
                    ret = valueFormatterWhole.format(a);
                    break;
                default:
                    if (!prec) {
                        prec = String(a).replace('.', '').length - a.toFixed().length;
                    }
                    let valueFormatterDec: IValueFormatter = ValueFormatter.create({ value: 0, cultureSelector: "cs-CZ", precision: prec });
                    ret = valueFormatterDec.format(a);
                    break;
            }

            return ret;

        }


    }
}