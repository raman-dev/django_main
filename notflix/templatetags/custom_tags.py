from django import template
import math
register = template.Library()

MINUTE_SECONDS = 60
HOURS_SECONDS = MINUTE_SECONDS * 60
@register.filter()
def readable_runtime(runtime):
    #return human readable runtime from seconds
    time= int(runtime)
    hours = time // HOURS_SECONDS
    minutes = math.floor(60*((time / HOURS_SECONDS) - hours))
    if minutes < 1:
        return str(hours) + "h"
    else:
        return str(hours) + "h "+str(minutes) + "m"

#register.filter('readable_runtime',readable_runtime)