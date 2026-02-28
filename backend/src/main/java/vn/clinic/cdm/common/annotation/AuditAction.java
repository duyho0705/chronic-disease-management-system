package vn.clinic.cdm.common.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Enterprise Audit Annotation.
 * Apply to controller methods to automatically log actions.
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface AuditAction {
    String value(); // The action name, e.g., "VIEW_PATIENT_LIST"
}
