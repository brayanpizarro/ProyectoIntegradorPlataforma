-- Agregar columna status_detalle a la tabla estudiante
-- Esta columna almacenará detalles adicionales sobre el status del estudiante

DO $$
BEGIN
    -- Verificar si la columna ya existe antes de agregarla
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'estudiante' 
        AND column_name = 'status_detalle'
    ) THEN
        -- Agregar la columna
        ALTER TABLE estudiante 
        ADD COLUMN status_detalle TEXT NULL;
        
        RAISE NOTICE '✅ Columna status_detalle agregada exitosamente a estudiante';
    ELSE
        RAISE NOTICE 'ℹ️ La columna status_detalle ya existe en estudiante';
    END IF;
END $$;
