ALTER TABLE queue_entry ADD COLUMN medical_service_id UUID REFERENCES medical_service(id);
ALTER TABLE queue_entry ADD COLUMN notes TEXT;
ALTER TABLE queue_definition ADD COLUMN room_or_station VARCHAR(64);
