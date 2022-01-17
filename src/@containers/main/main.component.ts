import { Component, OnInit } from '@angular/core';
import * as Plotly from 'plotly.js-dist-min';
import { Data } from 'plotly.js/lib/core';

interface IRawDataSet {
    filterFunc: string,
    color: string,
    size: number,
}

interface IData {
    [key: string] : number
}

type TAxis = "x-axis" | "y-axis" | "z-axis";

class RawDataSet implements IRawDataSet {
    constructor(
        public filterFunc: string,
        public color: string,
        public size: number,
    ) {}
}

const defaultRawDataSet = {
    filterFunc: "false",
    color: 'white',
    size: 0.01,
};

@Component({
  selector: 'custom-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})

export class MainComponent implements OnInit {
    public axisFields: TAxis[] = ['x-axis', 'y-axis', 'z-axis'];
    public selectedAxis: any = { "x-axis": "", "y-axis":"", "z-axis": "" };
    public fileName: string = '';
    public dataKeys: { length: number, value: string }[] = [];
    public plot: Plotly.PlotlyHTMLElement | undefined;
    public rawDataSets: IRawDataSet[] = [];
    private convrtedData: IData[] = [];
    private _loading: boolean = false;

    constructor() { }

    get loading() {
        return this._loading;
    }

    set loading(value: boolean) {
        this._loading = value;
    }

    ngOnInit() {
        this.loadChart();
    }

    // isFilterValid(filter: string) {
    //     try {
    //         const fullString = `(item, index, array)=>asfasfs`;
    //         const filterFunc = eval(fullString);
    //         const res = filterFunc;
    //         console.log(res);
    //         return true
    //     } catch (err) {
    //         console.log('err')
    //         return false;
    //     }
    // }

    dataChange(typeData: string, event: any, i: number) {
        if (event.type === 'keydown') event.preventDefault();
        const value = event?.target?.value;
        if (!value || !this.rawDataSets[i]) return;
        if (typeData === 'color') this.rawDataSets[i].color = value;
        if (typeData === 'size') this.rawDataSets[i].size = value;
        if (typeData === 'filter') this.rawDataSets[i].filterFunc = value;
        this.loadChart();
    }

    addDataSet() {
        this.loading = true;
        const newDataSet = new RawDataSet(`item`, 'green', 3)
        this.rawDataSets.push(newDataSet);
        this.loadChart();
    }

    selectChange(event: any, axis: string) {
        this.selectedAxis[axis] = event.target.value;
        this.loadChart();
    }

    async onCsvSelect(event: any) {
        this.loading = true;
        this.fileName = this._getFileName(event.target.value);
        await this._readFile(event.target.files[0]);
        this.rawDataSets = [];
        this.convrtedData = [];
        this.dataKeys = [];
        this.selectedAxis = { "x-axis": "", "y-axis":"", "z-axis": "" };
        this.loadChart();
    }

    onFocusOutTextArea(element: any) {
        element.style.height = '100%';
    }

    async loadChart () {
        this.loading = true;
        await this.updateChart(0);
        this.loading = false;
    }

    private async updateChart(ms: number) {
        return new Promise((res) => setTimeout(async () => {
            const data: Data[] = this.getData();
            const layout = this.getLayout();
            const options = this.getChartOptions();
            this.plot = await Plotly.newPlot('chart', data, layout, options);
            res(true);
        }, ms));
    }

    private getData(): Data[] {
        return [defaultRawDataSet, ...this.rawDataSets].map(data => {
            const { filterFunc, size, color } = data;
            const _filterFunc = eval('(item, index, array)=>' + filterFunc);
            return {
                x: this._getDataFromSelectedAxis("x-axis", _filterFunc),
                y: this._getDataFromSelectedAxis("y-axis", _filterFunc),
                z: this._getDataFromSelectedAxis("z-axis", _filterFunc),
                type: 'scatter3d',
                mode: 'markers',
                marker: { color, size },
            };
        });
    }

    private getLayout(): Partial<Plotly.Layout> {
        return {
            title: {
                text: 'Graph CSV',
                font: {
                    color: 'rgba(0,0,0,0.05)',
                    size: 50,
                }
            },
            autosize: true,
            paper_bgcolor: 'rgb(230,230,230)',
            height: 600,
            dragmode: "orbit",
            showlegend: false,
          };
    }

    private getChartOptions(): Partial<Plotly.Config> {
        return {
            editable: true,
            displaylogo: false,
            modeBarButtonsToRemove: ["lasso2d", "select2d", "resetCameraLastSave3d", "tableRotation"],
          };
    }

    private _getDataFromSelectedAxis(axis: string, filterFunc: (a: any) => boolean) {
        if (!this.convrtedData.length) return [0];
        const selectedAxis = this.selectedAxis[axis];
        return this.convrtedData.map(e => {
            try {
                if (!selectedAxis) return 0;
                if (!filterFunc(e)) return 0;
                return e[selectedAxis] || 0;
            } catch (err) {
                return 0;
            }
        });
    }

    private async _readFile(file: File) {
        new Promise(resolve => {
            const fileReader = new FileReader();
            fileReader.readAsText(file)
            fileReader.onload = async (res) => {
                try {
                    const dataString = res.target?.result;
                    if (typeof dataString !== 'string') return;
                    const convertedData = await this._convertData(dataString);
                    this.dataKeys = this._loadDataKeys(convertedData)
                    this.convrtedData = convertedData;
                    resolve(true);
                } catch (err) {
                    console.log(err);
                    resolve(true);
                }
            }
        })
    }

    private _getFileName(fullPath: string) {
        const _arr = fullPath.split("\\");
        const _fileName = _arr[_arr.length - 1];
        const fileName = _fileName.length < 21 ? _fileName : "..." + _fileName.slice(-24)
        return fileName;
    }

    private _loadDataKeys(data: IData[]) {
        return [...new Set(...data.map(r => Object.keys(r)))].map(e => ({
            length: data.map(i => i[e]).filter(e => e).length,
            value: e,
        })).filter(e => e.length).sort((a, b) => b.length - a.length)
    }

    private _convertData(stringData: string): Promise<IData[]> {
        return new Promise((res, rej) => {
            try {
                const result = stringData.split('\n');
                const keys = result[0].split(',');
                result.shift();
                const finalArr: IData[] = []
                result.forEach(d => {
                    const arr = d.split(',');
                    const data: IData = {};
                    keys.forEach((d2, i) => data[d2] = parseFloat(arr[i]));
                    finalArr.push(data);
                });
                res(finalArr);
            } catch (err: any) {
                rej(err.message);
            }
        });
    }
}