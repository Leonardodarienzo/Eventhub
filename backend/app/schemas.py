from marshmallow import Schema, fields, validate

class EventSchema(Schema):
    id = fields.Int(dump_only=True)
    title = fields.Str(required=True, validate=validate.Length(min=3, max=150))
    description = fields.Str(required=True, validate=validate.Length(min=10))
    date = fields.DateTime(required=True) # Formato ISO: YYYY-MM-DDTHH:MM:SS
    location = fields.Str(required=True, validate=validate.Length(min=2, max=150))
    category = fields.Str(required=True, validate=validate.OneOf(["concerto", "workshop", "presentazione_libro"]))
    price = fields.Float(required=True, validate=validate.Range(min=0.0))
    total_seats = fields.Int(required=True, validate=validate.Range(min=1))
    available_seats = fields.Int(dump_only=True)
    cover_image = fields.Str(dump_only=True)
    organizer_id = fields.Int(dump_only=True)

class ReviewSchema(Schema):
    id = fields.Int(dump_only=True)
    rating = fields.Int(required=True, validate=validate.Range(min=1, max=5))
    comment = fields.Str(validate=validate.Length(max=1000))
    created_at = fields.DateTime(dump_only=True)

# Inizializziamo le istanze per usarle agilmente nelle rotte
event_schema = EventSchema()
events_schema = EventSchema(many=True)
review_schema = ReviewSchema()