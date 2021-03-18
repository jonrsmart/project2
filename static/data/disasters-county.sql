select d.fipsStateCode, d.fipsCountyCode, count(disasterNumber), f.name, f.geometry
from disasters as d
inner join features as f on f.state = d.fipsStateCode and f.county = d.fipsCountyCode
group by fipsCountyCode
order by fipsStateCode;