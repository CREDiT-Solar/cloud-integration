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
Return Value: JSON object with irradiance values in watts per square meter (W/m²).