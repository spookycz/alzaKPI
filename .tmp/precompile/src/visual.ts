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

module powerbi.extensibility.visual.alzaKPIB4B1B6D1E62543DCB1B68B5EC8979367  {
    "use strict";

    interface DataPoint {
        category: string;
        actualValue: string;
        previousValue: string;
        textInfo: string;
        crisisInfo: string;
    }
    interface ViewModel {
        dataPoints: DataPoint[];
        maxValue: number;
    }

    export class Visual implements IVisual {
        private host: IVisualHost;
        private svg: d3.Selection<SVGElement>;
        private container: d3.Selection<SVGElement>;
        private category: d3.Selection<SVGElement>;
        private circle: d3.Selection<SVGElement>;
        private actualValueText: d3.Selection<SVGElement>;
        private previousValueText: d3.Selection<SVGElement>;
        private kpiLabel: d3.Selection<SVGElement>;
        private infoTextText: d3.Selection<SVGElement>;
        private crisisTextText: d3.Selection<SVGElement>;

        constructor(options: VisualConstructorOptions) {
            this.svg = d3.select(options.element)
                .append('svg')
                .classed('circleCard', true);
            this.container = this.svg.append("g")
                .classed('container', true);
            this.category = this.svg.append("g")
                .classed('category', true);
            this.circle = this.container.append("circle")
                .classed('circle', true);
            this.actualValueText = this.container.append("text")
                .classed("actualValueText", true);
            this.previousValueText = this.container.append("text")
                .classed("previousValueText", true);
            this.kpiLabel = this.container.append("text")
                .classed("kbiLabel", true);
            this.infoTextText = this.container.append("text")
                .classed("infoTextText",true);
            this.crisisTextText = this.container.append("text")
                .classed("crisisTextText", true);
        }

        public update(options: VisualUpdateOptions) {
            let dataView: DataView = options.dataViews[0];
            let width: number = options.viewport.width;
            let height: number = options.viewport.height;

            let viewModel = this.getViewModel(options);
            //console.log(viewModel);
            this.svg.attr({
                width: width,
                height: height
            });
            let radius: number = Math.min(width, height) / 2.2;
            let fontSizeValue: number = Math.min(width, height) / 5;
            this.actualValueText
                .text(viewModel.dataPoints[0].actualValue)
                .attr({
                    x: "50%",
                    y: "20%",
                    dy: "0.35em",
                    "text-anchor": "middle"
                }).style("font-size", fontSizeValue + "px");
            this.previousValueText
                .text(viewModel.dataPoints[0].previousValue)
                .attr({
                    x: "50%",
                    y: "40%",
                    dy: "0.35em",
                    "text-anchor": "middle"
                }).style("font-size", fontSizeValue + "px");
                this.infoTextText
                .text(viewModel.dataPoints[0].textInfo)
                .attr({
                    x: "50%",
                    y: "60%",
                    dy: "0.35em",
                    "text-anchor": "middle",
                    color: "FF0000"
                }).style("font-size", fontSizeValue + "px");
                this.crisisTextText
                .text(viewModel.dataPoints[0].crisisInfo)
                .attr({
                    x: "50%",
                    y: "80%",
                    dy: "0.35em",
                    "text-anchor": "middle"
                }).style("font-size", fontSizeValue + "px");
            //let fontSizeLabel: number = fontSizeValue / 4;
            this.kpiLabel
                .text(viewModel.dataPoints[0].category)
                .attr({
                    x: "50%",
                    y: "10%" ,
                    dy: "0.35em",
                    "text-anchor": "middle"
                })
                .style("font-size", fontSizeValue + "px");
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
                        actualValue: <string>actualvalues.values[i],
                        previousValue: <string>previousvalues.values[i],
                        textInfo: <string>infoTexts.values[i],
                        crisisInfo: <string>crisisTexts.values[i]

                    }
                );
            }
            viewModel.maxValue = 0
            return viewModel;
        };

    }
}