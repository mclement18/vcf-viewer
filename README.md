# VCF Viewer

A test app to explore `.vcf` files

## Starting dev server

First install deps

```
yarn install
```

Then start dev server

```
yarn dev
```

## Run production

A production version is provided as a Docker image  
To run it you need to have Docker installed.

First build image

```
# In the repo
docker build -t vcf-viewer .
```

Then run a container that forward the port `3000`.

```
docker run --rm -p "3000:3000" vcf-viewer
```

You can then access the app at http://localhost:3000

## Description

The viewer is developed using the [**_Next.js_**](https://nextjs.org/) framework with [**_TailwindCSS_**](https://tailwindcss.com/) and [**_headlessUI_**](https://headlessui.com/) for styling and [**_Apache ECharts_**](https://echarts.apache.org/en/index.html) for charting.

It consists in a single page app that allows the user to upload a `.vcf` file and then provide a graphical summary of the content. The summary is composed in two parts. The first one provides a global summary of the file content and the second one provides different visualisations of the data per chromosome and allows to easily compare charts side-by-side.

The `.vcf` file must contain (apart from the standard mandatory fields) the following tags in the `ÌNFO` field:

| ID       | Description                                                                                                                                                                                                      |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NVF`    | Adjusted Allele fraction of the alternate allele with regard to reference based on graph quant                                                                                                                   |
| `TYPE`   | Indicates whether variant is `SNP` \| `INDEL`.                                                                                                                                                                   |
| `DBXREF` | Colon-separated key-value pairs of overlaps in database e.g. `dbSNP:rs838532,COSMIC:COSM28362`                                                                                                                   |
| `SGVEP`  | Variant effect predicted annotations, contains a '`\|`' separated list of attributes (`gene\|gene_strand\|tx_name\|exon_rank\|c.DNA\|protein\|codingConsequence`), missing attributes are represented with '`.`' |

## Reference, Data & Limitations

The chart types from the second part of the summary were inspired from the **_R_** package [`plotVCF`](https://github.com/cccnrc/plot-VCF).

The chromosome _lengths_ were taken from the [**GRCh37.p13**](https://www.ncbi.nlm.nih.gov/datasets/genome/GCF_000001405.25/) genome assembly whereas the chromosome _gene counts_ were taken from the [**GRCh38.p14**](https://www.ncbi.nlm.nih.gov/datasets/genome/GCA_000001405.29/) genome assembly. This discrepancy is explained by the fact that the sample data for which this tool was developed was based on the GRCh37 genome assembly which has no info on the gene counts per chromosome needed for some of the visualisations.

The viewer capacity to display information regarding the variant coding consequences is limited to values found in the sample data used to develop the tool. The full list of values recognised is available in the file `src/constants/coding_consequences.ts`.
