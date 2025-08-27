### Backend
TBC - backend hosted on AWS Lightsail

### ISA-API
API Access to the ISA Server. Requires to be connected to University network, either onsite or through VPN

#### Schema

`/current_solar_prod` 
-
Method: GET

Description: Returns the current solar production for the site, averaged across all inverters, smoothed over the last 5 minutes.

Arguments: None

Return Value: JSON array containing the total site production in kW.

`/historical_solar_prod`
-
Method: POST

Description: Returns historical solar production data for a given period, smoothed over appropriate intervals.

Arguments: JSON body with:
`period`: string, one of `hour`, `day`, `24-hour`, `week`, `month`, `year`. Defaults to day

Return Value: JSON array of timestamped kW values.

`/get_voltage`
-
Method: GET
Description: Returns the latest voltage averaged across all inverters and three phases, smoothed over the last 5 minutes.

Arguments: None

Return Value: JSON array containing the average voltage in volts.

`/get_current`
-
Method: GET

Description: Returns the latest current averaged across all inverters and three phases, smoothed over the last 5 minutes.

Arguments: None

Return Value: JSON array containing the average current in amperes.

`/solar_energy_totals`
-
Method: POST
Description: Returns the total solar energy produced for a specified timeframe.

Arguments: JSON body with:
`period`: string, one of `hour`, `day`, `24-hour`, `week`, `month`, `year`. Defaults to day

Return Value: JSON array with the total energy produced in watts

`/get_temperature`
-
Method: GET

Description: Returns the most recent CS240DM temperature from the ground datalogger.

Arguments: None

Return Value: JSON object with the latest temperature in degrees Celsius (°C).

`/get_humidity`
-
Method: GET

Description: Returns the most recent relative humidity (RH) from the ground datalogger.

Arguments: None

Return Value: JSON object with the latest humidity in percent (%).

`/get_irradiance`
-
Method: GET

Description: Returns the most recent solar irradiance readings from the ground datalogger. Provides averages for SR30 and SR05 pyranometer channels.

Arguments: None

Return Value: JSON object with irradiance values in watts per square meter (W/m²). 0 is SR30 value, 1 is SR05 value

`/get_battery_voltage`
-
Method: GET

Description: Returns the instantaneous battery voltage.

Arguments: None

Return Value: JSON object containing voltage (V)

`/get_battery_current`
-
Method: GET

Description: Returns the instantaneous battery current.

Arguments: None

Return Value: JSON object containing current (A)

`/get_battery_percentage`
-
Method: GET

Description: Returns the current battery level as a percentage.

Arguments: None

Return Value: JSON object containing battery SoC (%)

`/get_battery_state`
-
Method: GET

Description: Returns whether the battery is charging or discharging.

Arguments: None

Return Value: JSON object containing "charging" or "discharging"

`/battery_percentage_timeseries`
-
Method: POST

Description: Returns battery voltage as a percentage over a specified period with intervals appropriate to the period.

Arguments: JSON body with period: string, one of `hour`, `day`, `24-hour`, `week`, `month`, `year`. Defaults to day

Return Value: JSON array of [timestamp, percentage] values.

`/current_load`
-
Method: GET

Description: Returns the current load on the system.

Arguments: None

Return Value: JSON object containing load (kW)

`/total_load_today`
-
Method: GET

Description: Returns the total energy consumed today.

Arguments: None

Return Value: JSON object containing total_load (kWh)

`/peak_load_today`
-
Method: GET

Description: Returns the peak load observed during the current day.

Arguments: None

Return Value: JSON object containing peak_load (kW)

`/grid_self_consumption`
-
Method: POST

Description: Returns the percentage of load supplied by solar panels versus the grid over a specified period.

Arguments: JSON body with period: string, one of `hour`, `day`, `24-hour`, `week`, `month`, `year`. Defaults to day

Return Value: JSON array of [timestamp, percentage] values.

`/grid_status`
-
Method: POST

Description: Returns energy consumed from the grid over a specified period.

Arguments: JSON body with period: string, one of `hour`, `day`, `24-hour`, `week`, `month`, `year`. Defaults to day

Return Value: JSON array of [timestamp, kWh] values.

`/solar_energy_usage`
-
Method: POST

Description: Returns historical solar energy consumption as a timeseries for a specified period.

Arguments: JSON body with period: string, one of `hour`, `day`, `24-hour`, `week`, `month`, `year`. Defaults to day

Return Value: JSON array of [timestamp, kWh] values.

`/solar_energy_total`
-
Method: POST

Description: Returns the total solar energy consumed over a specified period.

Arguments: JSON body with period: string, one of `hour`, `day`, `24-hour`, `week`, `month`, `year`. Defaults to day

Return Value: JSON object containing total_energy (kWh)

`/get_panel_voltage`
-
Method: GET

Description: Returns the current panel voltage

Arguments: None

Return Value: JSON object containing current panel voltage (V)

`/get_panel_current`
-
Method: GET

Description: Returns the current panel current

Arguments: None

Return Value: JSON object containing current panel current (A)

`/solar_prod_sum`
-
METHOD: POST

Description: Returns the total solar energy for a given period.

Arguments: JSON body with period: string, one of `hour`, `day`, `24-hour`, `week`, `month`, `year`. Defaults to day

Return Value: JSON Object with the total solar energy generated for the given period (kW).