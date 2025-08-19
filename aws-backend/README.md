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