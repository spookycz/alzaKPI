/*
 *  Power BI Visualizations
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
    import DataViewObjectsParser = powerbi.extensibility.utils.dataview.DataViewObjectsParser;

     export class KpiSettings {
         
         public defaultColor: string = "black";
         public actualValueFontSize: number = 50;
         public dataType: string = "whole";
         public precision: number = 2;
     }
      export class TextSettings {
        public crisisTextColor: string = "red";
        public crisisTextFontSize: number = 35;
        public infoTextColor: string = "black";
        public infoTextFontSize: number = 20;

      }
      export class KpiLabelSettings {
        public kpiLabelFontSize: number = 25;
        public kpiDefaultColor: string = "black"
      }
      export class PreviousValuesSettings {
        public previousValueColor: string = "black";
        public previousValueFontSize: number = 20;
        public prefixType: string = "Včera:"
      }
     export class VisualSettings extends DataViewObjectsParser {
         public dataLabel: KpiSettings = new KpiSettings();
         public kpiTitle: KpiLabelSettings = new KpiLabelSettings();
         public previousValues: PreviousValuesSettings = new PreviousValuesSettings();
         public textValues: TextSettings = new TextSettings();

     }


}
