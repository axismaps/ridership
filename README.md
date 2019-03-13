# Ridership Visualization

## Installation

> This project uses git-lfs to store large data files in the repository. Please install git-lfs before cloning the repo.

To install all the application dependencies for the project, run:

```sh
npm install
```

The data processing tools are written in Python and use pip to manage dependencies. Once Python 2.7 and pip are installed, install the other dependencies with:

```sh
pip install -r requirements.txt 
```

### Additional Dependencies

In addition to the software dependencies automatically installed, the data tools require 2 additional packages installed manually.

The first is a globally installed Mapshaper binary:

```sh
npm install -g map shaper
```

The second is [libspatialindex](https://libspatialindex.org/install.html) (used to calculate distance buffers). 

## Building

The project is built using webpack. Start a development server with:

```sh
npm run dev
```

Or build the full application for deployment using:

```sh
npm run build
```

The deploy script builds the application and automatically deploys it to S3 (requires the `aws-cli` and proper credentials stored in path):

```sh
npm run deploy
```

## Creating Datasets

All of the data in the project is built directly from sources downloaded from:

* NTD Website
* The Census API
* Transit.land

### Environment Variables

Before building the datasets, there are 2 additional files that need to be created. There are 3 credentials stored in `bin/settings.py` that are accessed by Python scripts. This file should look like:

```py
CARTO_USER = '<Carto username>'
CARTO_API = '<Carto API key>'
CENSUS_API = '<US Census API key>'
```

The only credential stored in the `.env` file is for Mapbox. This is used to upload the transit MBTiles. This file should look like:

```env
export MAPBOX_ACCESS_TOKEN=<secret access token>
```

### Combined Data Commands

The essential data scripts are collected into a single command which can be run with:

```sh
npm run data
```

The performs 3 separate tasks:

It creates metadata about each transit agency and its corresponding MSA stored in the Transit_Agencies_for_Visualization.xls spreadsheet:

```sh
npm run data:meta
```

After that, it creates the main data file with all of the ridership indicators:

```sh
npm run data:clean
```
 
This script pulls data from the main NTD database files as well as accompanying files storing data on:

* Maintenance
* Service
* Gas prices
* Service area population

The final script creates the tracts GeoJSON files used in the MSA view of the map. It divides them by MSA, generates a file for all of the high frequency stops, and calculates the distance from the tract to the closest stop. It can be run on its own with:

```sh
npm run data:tracts
```

### Additional Data Commands

There are a few additional data commands. These aren't required to run the project and are intended to update or extend the data.

#### Loading Census Data

The Census data used in the project is already available in the repository. To update this data or add additional data, run:

```sh
npm run data:census
```

The script checks the data/output/census/ directory and won't attempt to download any indicator that has a CSV present. The configuration for which indicators are downloaded and how they are stored is in data/census/acs.json.

#### Generating New Vector Tiles

The transit data displayed on the MSA-level basemap is served from Mapbox where it is combined with a generalized basemap. To render new transit tiles, run:

```sh
npm run tiles
```

In addition to rendering the tiles from the geographic data downloaded from Transit.land, the script attempts to join the routes to the transit agencies included in the project by matching their names.

#### Downloading New Transit Data

To download new routes and stops from Transit.land, run:

```sh
npm run data:transit
```

## Embedding Maps

The map can be embedded on a webpage using a variety of configuration options appended to the URL. These include:

| Parameter | Values | Use |
|:--|:--|:--|
| dropdownsOff | true | Removes indicator selection dropdowns from UI, forcing the map to use only the selected indicators |
| compared | A pipe-separated (\|) array of taid's | Selects TAs to include in the visualization |
| embed | atlas, msaAtlas, sidebar | Specifies the visualization component to be embedded |
| sidebarView | sparklines, pcp | Specifies which graphic to display when `embed=sidebar` |
| distanceFilter | 0.25, 0.5, 1 | Pre-selects the distance filter value when in MSA view |
| indicator | Any column header found in ntd.csv or census.csv | Specifies selected indicator when map loads. For sparklines / PCP, use a pipe-separated array of indicators |
| msa | 5-digit MSA ID | Specifies MSA to use when in msaAtlas view |
| nationalDataView | ta, msa | Toggles between TA or MSA bubbles when `embed=atlas` |
| histogramOff | true | Removes histogram from embedded atlas |
| expanded | true | Start sparklines expanded |