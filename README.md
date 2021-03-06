# WLED-Panel

My panel is a LED strip RGB with 300 led. The matrix is 15 pixel (h) x 20 pixel (w). 

![all](led.png)

## Installation instructions

configuration.yaml
```yaml
shell_command:
  ledpanel: 'python3 /config/python_scripts/ledpanel.py {{animation}}'
```

ui-lovelace.yaml 
```yaml
type: entities
entities:
  - input_select.ledpanel_options
```

automations.yaml
```yaml
- alias: LedPanel Animations
  trigger:
  - platform: state
    entity_id: input_select.ledpanel_options
  action:
  - data_template:
      animation: "{{ states('input_select.ledpanel_options') }}"
    service: shell_command.ledpanel

- alias: Test Panel
  trigger:
    platform: state
    entity_id: XXXXXXXXXX
    to: 'on'
  action:
  - service: light.turn_on
    entity_id: light.led_panel
  - data_template:
      animation: 'heart'
    service: shell_command.ledpanel
```
